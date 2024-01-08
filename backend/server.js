import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import blogRoutes from "./routes/blogs.js";
import cookieParser from "cookie-parser";
dotenv.config();


const app = express();
app.use(cors({credentials: true, origin: "http://localhost:3000"}));
app.use(cookieParser());
app.use(express.json());
app.use("/static", express.static('public1'))
app.use("/staticTempProfile", express.static('tempProfiles'));
app.use("/staticProfile", express.static('profiles'))
app.use('/users', userRoutes);
app.use('/blogs', blogRoutes);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.CONNECTION_URL)
    .then(response => {
        app.listen(process.env.PORT, () => {
            console.log(`Connected to MONGO DB and Server running on PORT - ${process.env.PORT}.`)
        })
    })
    .catch(error => console.log(error));

