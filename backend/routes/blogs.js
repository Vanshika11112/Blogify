import express from "express";
import multer from "multer";
import { addBlog, deleteBlog, getAllBlogs, getBlog, getUserBlogs, updateBlog, verifyAccessToken, verifyRefreshToken } from "../controllers/blogsController.js";
import Blogs from "../models/blogsModel.js";
import path from "path"

const router = express.Router();

router.post("/", verifyAccessToken, verifyRefreshToken, getAllBlogs);

router.post("/create", verifyAccessToken, verifyRefreshToken, addBlog);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public1/")
    },
    filename: (req, file, cb) => {
        cb(null, new Date(Date.now()) + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage })

router.post("/addImage", upload.single("myFile"), async (req, res) => {
    const imageUrl = req.file.filename;
    const id = req.body;
    await Blogs.findByIdAndUpdate(id, {
        imageUrl: imageUrl
    });
    return res.status(200).json({ message: "File uploaded successfully" });
});

router.delete("/deleteBlog", verifyAccessToken, verifyRefreshToken, deleteBlog);

router.post("/getBlog", verifyAccessToken, verifyRefreshToken, getBlog);

router.patch("/updateBlog", verifyAccessToken, verifyRefreshToken, updateBlog);

router.post("/userBlogs", verifyAccessToken, verifyRefreshToken, getUserBlogs);

export default router;