import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Blogs from "./Blogs";
import FilterDashBoard from "./FilterDashBoard";

const Home = ({ userId, setUserId, setBlogId, setFilter, filter, setSortOrder, sortOrder }) => {

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const URL = "http://localhost:5000/users";
    const [render, setRender] = useState(false);

    const sendCookie = async () => {
        try {
            const response = await axios.post(`${URL}/verifyTokens`, {
                id: localStorage.getItem('userId')
            })

            if (response.status === 200) {
                setUserId(response.data.id)
                setRender(true);
            }
        } catch (error) {
            if (error.response.status === 401) {
                navigate("/login");
                setRender(false);
            }
        }
    }
    useEffect(() => {
        setFilter("");
        sendCookie();
        setBlogId(null);
    }, [])


    return (
        render && <div className="px-4 py-6 flex justify-between items-start gap-4">
            <div className="w-[70%]">
                <Blogs filter={filter} sortOrder={sortOrder} setBlogId={setBlogId} userId={userId} />
            </div>
            <div className="flex-1 flex flex-col gap-4 bg-white p-4">
                <FilterDashBoard filter={filter} setSortOrder={setSortOrder} sortOrder={sortOrder} setFilter={setFilter} />
            </div>
        </div>
    )
}

export default Home