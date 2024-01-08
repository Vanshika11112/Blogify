import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 18
    },
    accessToken: {
        type: String,
        default: ''
    },
    totalBlogs: {
        type: Number,
        default: 0
    },
    profileImg: {
        type: String
    }
});

const User = mongoose.model('user', userSchema)

export default User;