import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import ProfileDetails from "./ProfileDetails";
import LogoutIcon from '@mui/icons-material/Logout';
import ProfilePic from "./ProfilePic";

const UserProfile = ({ setUserId }) => {

    const navigate = useNavigate();
    const [render, setRender] = useState(false);
    const [name, setName] = useState("");
    const [profilePic, setProfilePic] = useState(null);
    const [tempProfile, setTempProfile] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const URL = "http://localhost:5000/users";

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

    const sendImage = (e) => {
        const formData = new FormData();
        formData.append("myFile", e.target.files[0]);
        axios.post(`${URL}/uploadProfilePic`, formData)
            .then(res => setTempProfile(res.data.fileName));
    }

    const updateProfilePic = async () => {
        const formData = new FormData();
        formData.append("myFile", profilePic);
        formData.append("id", localStorage.getItem("userId"));
        axios.post(`${URL}/updateProfile`, formData)
            .then(res => setSuccessMessage(res.data.message));
    }

    const logout = async () => {
        try {
            const response = await axios.post(`${URL}/logout`, {
                id: localStorage.getItem("userId")
            });
            if (response.status === 200) {
                localStorage.clear();
                setUserId(null);
                navigate("/login");
            }
        } catch (error) {
            console.log(error)
        }
    }



    useEffect(() => {
        sendCookie();
    }, [])

    return (
        render && <div className="px-4 py-6 flex items-stretch gap-2">
            <div className="w-[70%] bg-white  flex flex-col p-4">
                <ProfileDetails setName={setName} />
            </div>
            <div className="flex-1 bg-white flex flex-col gap-4 items-stretch p-4">
                <div className="w-[70%] cursor-pointer overflow-hidden rounded-full mx-auto hover:opacity-50 relative cursor-pointer">
                    {!profilePic && <ProfilePic />}
                    {tempProfile && <img src={`http://localhost:5000/staticTempProfile/${tempProfile}`} alt="" className="min-h-[210px] max-h-[210px] w-full object-cover" />}
                    <input type="file" name="myFile" className="absolute top-0 z-10 h-full w-full opacity-0" onChange={async (e) => {
                        setSuccessMessage(null);
                        setProfilePic(e.target.files[0])
                        try {
                            const response = await axios.post(`${URL}/changeProfile`, {
                                status: "changeProfile",
                                id: localStorage.getItem('userId')
                            });
                            if (response.status === 200) {
                                sendImage(e);
                            }
                        } catch (error) {
                            if (error.response.status === 401) {
                                navigate("/login");
                            }
                        }
                    }} />
                </div>
                {!successMessage && profilePic && <p onClick={updateProfilePic} className="text-[blue] text-sm text-center tracking-wider cursor-pointer">Update Profile Picture</p>}
                {successMessage && <p className="text-[seagreen] text-sm text-center">{successMessage}</p>}
                <p className="text-center text-md tracking-wider">{name}</p>
                <button onClick={logout} className="bg-[orange] text-white py-1 rounded-sm"><LogoutIcon style={{ fontSize: "18px", marginRight: 5 }} />Logout</button>
            </div>
        </div>
    )
}

export default UserProfile