import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import "../css/inputTypes.css";
// import AddIcon from '@mui/icons-material/Add';
// import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';

axios.defaults.withCredentials = true;
const AddBlog = ({ setUserId }) => {

    const navigate = useNavigate();
    const URL = "http://localhost:5000/blogs";
    const [render, setRender] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [error, setError] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [url, setUrl] = useState("");
    const [filter, setFilter] = useState("Fitness");
    const [image, setImage] = useState(null);

    const sendCookie = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/users/verifyTokens`, {
                id: localStorage.getItem('userId')
            })

            if (response.status === 200) {
                setUserId(response.data.id)
                setRender(true);
            }
        } catch (error) {
            if (error.response.status === 401) {
                setRender(false);
                navigate("/login");
            }
        }
    }

    const formSubmit = async (e) => {
        setDisabled(true)
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/create`, {
                title,
                description,
                url,
                filter,
                id: localStorage.getItem("userId")
            });
            if (response.status === 201) {
                if (image) {
                    const formData = new FormData();
                    formData.append("myFile", image);
                    formData.append("id", response.data.blog._id);
                    await axios.post(`${URL}/addImage`, formData).then(res => navigate("/"));
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
            }
            setError(error.response.data.error)
        }
        setDisabled(false);
    }

    useEffect(() => {
        sendCookie();
    }, [])

    return (
        render && <div className="mx-auto my-6 px-6 py-6 bg-white rounded-md flex flex-col w-[95%] md:w-[85%] gap-4">
            <h2 className="font-bold text-xl tracking-wider">Create a new Blog</h2>
            <form onSubmit={formSubmit} className="flex flex-col gap-5">
                <input name="title" onChange={(e) => setTitle(e.target.value)} value={title} className="py-[2px] tracking-wider border-b-[1px] border-grey focus:outline-none" type="text" placeholder="Blog Title" />
                <input onChange={(e) => setDescription(e.target.value)} value={description} className="py-[2px] tracking-wider border-b-[1px] border-grey focus:outline-none" type="text" placeholder="Blog Description" />
                <input onChange={(e) => setUrl(e.target.value)} value={url} className="py-[2px] tracking-wider border-b-[1px] border-grey focus:outline-none" type="url" placeholder="Add Link" />
                {/* <div className="relative inputFile-div">
                    <input className="z-20 opacity-0 top-0 absolute w-[17%]" type="file" name="myFile" onChange={(e) => {
                        setImage(e.target.files[0])
                        console.log(image)
                    }} />
                    <div className={`flex ${image && 'gap-2'} absolute left-0 w-[17%] z-10 justify-center items-center rounded-md top-0 text-white bg-[#ff0047] py-1 text-sm`}>
                        {!image && <AddIcon />}
                        {image && <ChangeCircleIcon />}
                        <button type="button" className="tracking-wider">{!image ? "UPLOAD PHOTO" : image.name.length <= 10 ? image.name : image.name.slice(0, 10)+"..."}</button>
                    </div>
                </div> */}
                <select onChange={(e) => setFilter(e.target.value)} value={filter} className="bg-[transparent] mt-8 border-2 py-1 focus:outline-none">
                    <option>Fitness</option>
                    <option>Music</option>
                    <option>Movies</option>
                    <option>Sports</option>
                </select>
                <p className="text-[red] tracking-wider text-sm">{error}</p>
                <button disabled={disabled} className={!disabled ? "bg-[orange] font-bold text-white rounded-sm py-1" : "bg-[#e39e20] font-bold text-white rounded-sm py-1"}>Add Blog</button>
            </form>
        </div>
    )
}

export default AddBlog