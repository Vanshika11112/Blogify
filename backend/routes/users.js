import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";
import Tokens from "../models/tokenModel.js";
import { verifyAccessToken, verifyRefreshToken, generateNewRefreshToken } from "../controllers/tokensController.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const 



router = express.Router();

router.post("/verifyTokens", verifyAccessToken, verifyRefreshToken, generateNewRefreshToken);

router.post("/changeProfile", verifyAccessToken, verifyRefreshToken, async (req, res) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: "Not Authorized" })

    return res.status(200).json({})
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./tempProfiles/")
    },
    filename: (req, file, cb) => {
        cb(null, (new Date(Date.now()).getTime() / 1000) + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

const deletePhoto = (filename) => {
    fs.unlink(`./tempProfiles/${filename}`, (err) => {
        err && console.log(err)
    });
}

router.post("/uploadProfilePic", upload.single("myFile"), async (req, res) => {
    const fileName = req.file.filename;
    setTimeout(() => deletePhoto(fileName), (1000 * 15))
    return res.status(200).json({ fileName })
});

const storage2 = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./profiles/")
    },
    filename: (req, file, cb) => {
        cb(null, (new Date(Date.now()).getTime() / 1000) + path.extname(file.originalname))
    }
});

const upload2 = multer({ storage: storage2 });

router.post("/updateProfile", upload2.single("myFile"), async (req, res) => {
    const filename = req.file.filename;
    const id = req.body.id;
    const userExist = await User.findById(id);
    if (!userExist.profileImg) {
        userExist.profileImg = filename;
        try {
            await userExist.save()
        } catch (error) {
            console.log(error)
        }
    } else {
        fs.unlink(`./profiles/${userExist.profileImg}`, (err) => {
            err && console.log(err)
        })
        await User.findByIdAndUpdate(id, {
            profileImg: filename
        });
    }

    return res.status(200).json({ message: "Profile pic Updated successfully!!" })
});

router.post("/getUserProfile", verifyAccessToken, verifyRefreshToken, async (req, res) => {
    const verified = req.user;
    const id = req.body.id;
    
    if (!verified) return res.status(401).json({error: "Not Authorized"});
    
    const userExist = await User.findById(id, "profileImg");

    return res.status(200).json({profileImg: userExist});


})

router.post("/changePass", verifyAccessToken, verifyRefreshToken, async (req, res) => {
    const user = req.user;
    const { oldPass, newPass, confirmPass } = req.body;

    if (!user) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    const userExist = await User.findById(user.id);

    const checkOldPass = await bcrypt.compare(oldPass, userExist.password);

    if (!checkOldPass) {
        return res.status(400).json({ error: "Incorrect Password" });
    }

    if (newPass !== confirmPass) {
        return res.status(400).json({ error: "Password does not match" });
    }

    const newHashedPassword = await bcrypt.hash(confirmPass, 10);

    userExist.password = newHashedPassword;
    await userExist.save();
    return res.status(200).json({ message: "Password updated" });
});

router.post('/logout', async (req, res) => {
    const { id } = req.body;

    await User.findByIdAndUpdate(id, {
        accessToken: ''
    });
    await Tokens.findOneAndDelete({ user: id });
    return res.status(200).json({ message: "Logged Out" });

});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Invalid username or password." });
    }

    if (!password) {
        return res.status(400).json({ error: "Invalid username or password." });
    }

    const userExist = await User.findOne({ username });

    if (!userExist) {
        return res.status(400).json({ error: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, userExist.password);

    if (!passwordMatch) {
        return res.status(400).json({ error: "Invalid username or password" });
    }

    const accessToken = jwt.sign({ id: userExist._id }, "access", {
        expiresIn: "15s"
    });
    const refreshToken = jwt.sign({ id: userExist._id }, "refresh", {
        expiresIn: "7d"
    });

    userExist.accessToken = accessToken;
    const refreshTokenExist = await Tokens.findOne({ user: userExist._id });

    if (refreshTokenExist) {
        try {
            await userExist.save();
            await Tokens.findOneAndUpdate({ user: userExist._id }, {
                token: refreshToken
            }, { new: true });
            res.cookie("jwt", accessToken, {
                expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
                httpOnly: true
            })
            return res.status(200).json({ message: "Refresh Token updated", user: userExist });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }

    } else {

        const newRefreshToken = new Tokens({
            user: userExist._id,
            token: refreshToken
        });

        try {
            await userExist.save();
            await newRefreshToken.save();
            res.cookie("jwt", accessToken, {
                expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 7)),
                httpOnly: true
            })
            return res.status(200).json({ message: "Refresh Token created", user: userExist, refreshToken: refreshToken });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }


});

router.post("/getUser", async (req, res) => {
    const { id } = req.body;

    const userExist = await User.findById(id);
    if (!userExist) return res.status(400).json({ error: "User does not exist" });

    return res.status(200).json({ user: userExist });
});

router.post('/signup', async (req, res) => {
    const { name, username, password, age } = req.body;

    if (!name) {
        return res.status(400).json({ error: "Name cannot be empty" });
    }

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }
    const userExist = await User.findOne({ username });

    if (userExist) {
        return res.status(409).json({ error: "An account with this username already exists" });
    }

    if (!password) {
        return res.status(400).json({ error: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        name,
        username,
        password: hashedPassword,
        age
    });

    try {
        newUser.save();
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
    return res.status(201).json({ user: newUser });
});

export default router;