import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";
import Tokens from "../models/tokenModel.js";

export const verifyAccessToken = async (req, res, next) => {
    const id = req.body.id;

    const userExist = await User.findById(id)

    if (!userExist) {

        return res.status(401).json({ error: "Not Authorized" });
    }

    const userDbAccessToken = userExist.accessToken;
    const userBrowserAccessToken = req.cookies.jwt;

    if (userDbAccessToken !== userBrowserAccessToken) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    jwt.verify(userDbAccessToken, "access", (err, user) => {
        if (err) {

        } else {
            req.user = user;
        }
    });
    next();
}

export const verifyRefreshToken = async (req, res, next) => {
    const id = req.body.id;
    const user = req.user;
    const {status} = req.body; 

    if (user) {
        if (!status) {
            return res.status(200).json({ message: "Authorized", id: user.id })
        } else if (status === "getProfile" || status === "changePass" || status === "changeProfile") {
            req.user = user;
        }
    }
    else {

        const tokenDoc = await Tokens.findOne({ user: id })
        if (!tokenDoc) return res.status(401).json({ error: "Not Authorized" })

        jwt.verify(tokenDoc.token, "refresh", async (err, user) => {
            if (err) {

            } else {
                req.user = user;
            }
        });
    }
    next();
}

export const generateNewRefreshToken = async (req, res) => {
    const user = req.user;

    if (!user) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    const accessToken = jwt.sign({ id: user.id }, "access", {
        expiresIn: '15s'
    })

    const refreshToken = jwt.sign({ id: user.id }, "refresh", {
        expiresIn: '7d'
    })

    await User.findByIdAndUpdate(user.id, {
        accessToken: accessToken
    }, { new: true })

    await Tokens.findOneAndUpdate({ user: user.id }, {
        token: refreshToken
    }, { new: true })

    res.cookie("jwt", accessToken, {
        expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
        httpOnly: true
    });

    res.status(200).json({ message: "Updated", id: user.id });
}