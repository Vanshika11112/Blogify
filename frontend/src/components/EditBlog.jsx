import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";


axios.defaults.withCredentials = true;
const EditBlog = ({ blogId }) => {

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const URL = "http://localhost:5000/blogs";
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [filter, setFilter] = useState("Fitness");

    const formSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(`${URL}/updateBlog`, {
                title,
                description,
                url,
                filter,
                blogId,
                id: localStorage.getItem("userId")
            })
            if (response.status === 200) {
                setError("");
                navigate("/");
            }
        } catch (error) {
            if (error.response.status === 400) {
                setError(error.response.data.error)
            }
        }
    }

    const fetchBlogDetails = async () => {
        try {
            const response = await axios.post(`${URL}/getBlog`, {
                id: localStorage.getItem("userId"),
                blogId
            })
            setTitle(response.data.blog.title);
            setDescription(response.data.blog.description);
            setUrl(response.data.blog.url);
            setFilter(response.data.blog.filter);
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            } else if (error.response.status === 400) {
                navigate("/");
            }
        }
    }

    useEffect(() => {
        fetchBlogDetails();
    }, [])

    return (
        <div className="mx-auto my-6 px-6 py-6 bg-white rounded-md flex flex-col w-[95%] md:w-[85%] gap-4">
            <h2 className="font-bold text-xl tracking-wider">Edit Blog</h2>
            <form onSubmit={formSubmit} className="flex flex-col gap-6">
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="py-[2px] tracking-wider border-b-[1px] border-grey focus:outline-none" type="text" placeholder="Blog Title" />
                <input value={description} onChange={(e) => setDescription(e.target.value)} className="py-[2px] tracking-wider border-b-[1px] border-grey focus:outline-none" type="text" placeholder="Blog Description" />
                <input value={url} onChange={(e) => setUrl(e.target.value)} className="py-[2px] tracking-wider border-b-[1px] border-grey focus:outline-none" type="url" placeholder="Add Link" />
                <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-[transparent] py-1 focus:outline-none">
                    <option>Fitness</option>
                    <option>Music</option>
                    <option>Movies</option>
                    <option>Sports</option>
                </select>
                <p className="text-[red] tracking-wider text-sm">{error}</p>
                <button className="bg-[orange] font-bold text-white rounded-sm py-1">Edit Blog</button>
            </form>
        </div>
    )
}

export default EditBlog