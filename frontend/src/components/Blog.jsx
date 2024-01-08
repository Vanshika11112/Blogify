import { formatDistanceToNow } from "date-fns"
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import SportsHandballOutlinedIcon from '@mui/icons-material/SportsHandballOutlined';
import MusicNoteOutlinedIcon from '@mui/icons-material/MusicNoteOutlined';
import MovieFilterOutlinedIcon from '@mui/icons-material/MovieFilterOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const Blog = ({ filterBlogs, blog, userId, setBlogId }) => {

    const navigate = useNavigate();
    const URL = "http://localhost:5000/blogs";
    const deleteBlog = async (blogId) => {
        try {
            const response = await axios.delete(`${URL}/deleteBlog`, {
                data: {
                    id: localStorage.getItem('userId'),
                    blogId
                }
            })
            if (response.status === 204) {
                filterBlogs(blogId);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
        }
    }

    return (
        <div className="shadow-sm flex flex-col items-start gap-2 bg-white rounded-md p-4">
            <div className="flex items-center justify-between w-full">
                <p className="font-bold tracking-wider text-sm">Author: <span className="font-normal">{blog.user.name}</span></p>
                {blog.filter === "Fitness" && <MonitorHeartOutlinedIcon />}
                {blog.filter === "Sports" && <SportsHandballOutlinedIcon />}
                {blog.filter === "Music" && <MusicNoteOutlinedIcon />}
                {blog.filter === "Movies" && <MovieFilterOutlinedIcon />}
            </div>
            {blog.user._id === userId && <div className="flex items-center gap-1">
                <EditIcon className="cursor-pointer" onClick={() => {
                    setBlogId(blog._id);
                    navigate("/editBlog");
                }} style={{ color: "blue", fontSize: 20 }} />
                <DeleteIcon className="cursor-pointer" onClick={() => deleteBlog(blog._id)} style={{ color: "red", fontSize: 20 }} />
            </div>}
            <hr className="w-full" />
            <div className="flex flex-col gap-2 mt-1 w-full">
                <p className="font-bold traci=king-wider">{blog.title}</p>
                {blog.imageUrl && <img className="max-h-[400px] object-fill" src={`http://localhost:5000/static/${blog.imageUrl}`} alt="Image Not Avaialable" />}
                <p className="tracking-wider text-justify">{blog.description}</p>
            </div>
            {blog.url && <p className="mt-1">Source - <a className="text-[blue]" href={blog.url}>{blog.url.length > 85 ? blog.url.slice(0, 83)+"..." : blog.url}</a></p>}
            <p className="tracking-wider text-[grey] text-sm mt-1">Posted {formatDistanceToNow(new Date(blog.createdAt), {
                addSuffix: true
            })}</p>
        </div>
    )
}

export default Blog