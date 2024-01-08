import { useNavigate } from "react-router-dom"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = ({ userId }) => {

    const navigate = useNavigate();

    return (
        <nav className="flex justify-between items-center shadow-md p-3 px-4">
            <h1 onClick={() => navigate("/")} className="text-xl cursor-pointer select-none font-bold tracking-wider">Blogify</h1>
            {userId && <ul className="flex justify-end gap-5 items-center pr-1">
                <li onClick={() => navigate("/addBlog")}>
                    <button className="p-1 px-2 rounded-sm hover:bg-black hover:text-white">Add Blog</button>
                </li>
                <li onClick={() => {
                    navigate("/userBlogs");
                }}>
                    <button className="p-1 px-2 rounded-sm hover:bg-black hover:text-white">My Blogs</button>
                </li>
                <li onClick={() => {
                    navigate("/profile");
                }}>
                    <button>
                        <AccountCircleIcon style={{ fontSize: "20px" }} />
                    </button>
                </li>
            </ul>}
        </nav>
    )
}

export default Navbar