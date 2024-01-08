import unknown from "../img/unknown.png"
import axios from "axios"
import { useEffect, useState } from "react"

const ProfilePic = () => {

    const URL = "http://localhost:5000/users";
    const [profileImg, setProfileImg] = useState("");

    const getUserProfile = async () => {
        try {
            const response = await axios.post(`${URL}/getUserProfile`, {
                id: localStorage.getItem("userId"),
                status: "getProfile"
            });
            if (response.status === 200) {
                setProfileImg(response.data.profileImg.profileImg)
                console.log(response.data.profileImg.profileImg)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUserProfile();
    }, [])

    return (
        <>
            {profileImg && <img className="z-30 min-h-[210px] max-h-[210px] w-full object-cover" src={`http://localhost:5000/staticProfile/${profileImg}`} />}
            {!profileImg && <img className="z-30 min-h-[210px] max-h-[210px] w-full object-cover" src={unknown} />}
        </>
    )
}

export default ProfilePic