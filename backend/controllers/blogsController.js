import Blogs from "../models/blogsModel.js"
import User from "../models/usersModel.js";
import Tokens from "../models/tokenModel.js";
import jwt from "jsonwebtoken";
import fs from "fs";

export const verifyAccessToken = async (req, res, next) => {
    const id = req.body.id;
    const userExist = await User.findById(id)
    if (!userExist) {
        return res.status(401).json({ error: "Not Authorized here" });
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
    const user = req.user;
    const id = req.body.id;

    if (user) {
        req.user = user;
        next();
    } else {
        const tokenDoc = await Tokens.findOne({ user: id })

        if (!tokenDoc) return res.status(401).json({ error: "Not Authorized" })

        jwt.verify(tokenDoc.token, "refresh", async (err, user) => {
            if (err) {

            } else {
                req.needsUpdate = true;
                req.user = user;
            }
        });
        next();
    }
}

export const getUserBlogs = async (req, res) => {
    const verified = req.user;

    if (!verified) return res.status(401).json({ error: "Not Authorized" });

    const userBlogs = await Blogs.find({ user: verified.id }).populate("user", "name");
    return res.status(200).json({ blogs: userBlogs, userId: verified.id });
}

export const getBlog = async (req, res) => {
    const { blogId } = req.body;
    const verified = req.user;

    if (!verified) return res.status(401).json({ error: "Not Authorized" });

    const blogExist = await Blogs.findById(blogId);
    if (!blogExist) return res.status(400).json({ error: "Blog does not exist" });
    return res.status(200).json({ blog: blogExist });
}

export const updateBlog = async (req, res) => {
    const verified = req.user;
    const { title, description, url, filter, blogId } = req.body;

    if (!verified) return res.status(401).json({ error: "Not Authorized" })

    if (!title) {
        return res.status(400).json({ error: "Title cannot be empty" })
    }

    if (!description) {
        return res.status(400).json({ error: "Description cannot be empty" })
    }

    const blogExist = await Blogs.findByIdAndUpdate(blogId, {
        title,
        description,
        url,
        filter
    }, { new: true });

    return res.status(200).json({ message: "Blog Updated" })
}

export const deleteBlog = async (req, res) => {
    const { blogId } = req.body;
    const verified = req.user;

    if (!verified) return res.status(401).json({ error: "Not Authorized" });

    const blog = await Blogs.findById(blogId);
    const userExist = await User.findById(blog.user);
    userExist.totalBlogs -= 1;

    console.log(blog.imageUrl)
    try {
        await Blogs.findByIdAndDelete(blogId);
        await userExist.save();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    blog.imageUrl && fs.unlink(`./public/${blog.imageUrl}`, (err) => {
        console.log(err);
    });

    return res.status(204).json({ message: "Blog deleted successfully" });
}

export const getAllBlogs = async (req, res) => {
    const user = req.user;
    const { filter, sortOrder } = req.body;
    if (!user) {
        return res.status(401).json({ error: "Not Authorized" });
    } else {
        const allBlogs = await Blogs.find().sort({ createdAt: sortOrder ? -1 : 1 }).populate("user", "name");
        if (filter === "") {
            return res.status(200).json({ blogs: allBlogs });
        } else {
            const filteredBlogs = allBlogs.filter(blog => blog.filter === filter);
            return res.status(200).json({ blogs: filteredBlogs });
        }

    }
}

export const addBlog = async (req, res) => {
    const verified = req.user;
    const { title, description, filter, url } = req.body;

    if (!verified) {
        return res.status(401).json({ error: "Not authorized" });
    }

    if (!title) {
        return res.status(400).json({ error: "Title cannot be empty" })
    }

    if (!description) {
        return res.status(400).json({ error: "Description cannot be empty" })
    }



    const user = verified.id;
    if (!user) {
        return res.status(400).json({ error: "User cannot be empty" })
    }

    const newBlog = new Blogs({
        title,
        description,
        filter,
        user: user,
        url
    });
    const userExist = await User.findById(user);
    userExist.totalBlogs += 1;

    try {
        await newBlog.save();
        await userExist.save();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ blog: newBlog });
}