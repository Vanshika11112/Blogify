import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Blog from "./Blog";
import Blogs from "./Blogs";
import FilterDashBoard from "./FilterDashBoard";

const UserBlogs = ({ setUserId, userId, setBlogId, setFilter, filter, setSortOrder, sortOrder }) => {

    const navigate = useNavigate();
    const URL = "http://localhost:5000/blogs";
    const [blogs, setBlogs] = useState([]);

    const getUserBlogs = async () => {
        try {
            const response = await axios.post(`${URL}/userBlogs`, {
                id: localStorage.getItem("userId")
            });
            setUserId(response.data.userId)
            setBlogs(response.data.blogs)
            // console.log(response.data.blogs)
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
        }
    }

    const filterBlogs = (blogId) => {
        const updatedBlogs = blogs.filter(blog => blog._id !== blogId)
        setBlogs(updatedBlogs);
    }

    useEffect(() => {
        getUserBlogs();
    }, [])

    return (

        blogs && <div className="px-4 py-6 flex justify-between items-start gap-4">
            <div className="w-[70%]">
                {blogs.map(blog => <Blog setBlogId={setBlogId} filterBlogs={filterBlogs} userId={userId} key={blog._id} blog={blog} />)}
            </div>
            <div className="flex-1 flex flex-col gap-4 bg-white p-4">
                <FilterDashBoard filter={filter} setSortOrder={setSortOrder} sortOrder={sortOrder} setFilter={setFilter} />
            </div>
        </div>
    )
}

export default UserBlogs