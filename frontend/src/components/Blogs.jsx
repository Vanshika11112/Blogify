import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Blog from "./Blog";


const Blogs = ({userId, setBlogId, filter, sortOrder}) => {

    const URL = "http://localhost:5000/blogs";
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    const getAllBlogs = async (filter, sortOrder) => {
        try {
            const response = await axios.post(`${URL}/`, {
                id: localStorage.getItem('userId'),
                filter,
                sortOrder
            });
            setBlogs(response.data.blogs);
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
        }
    }

    const filterBlogs = (blogId) => {
        const updatedBlogs = blogs.filter(blog => blog._id !== blogId);
        setBlogs(updatedBlogs);
    }

    useEffect(() => {
        getAllBlogs(filter, sortOrder);
    }, [filter, sortOrder])

    return (
        <div className="flex flex-col items-stretch gap-4">
            {blogs.map(blog => <Blog filterBlogs={filterBlogs} userId={userId} key={blog._id} blog={blog} setBlogId={setBlogId} />)}
        </div>
    )
}

export default Blogs