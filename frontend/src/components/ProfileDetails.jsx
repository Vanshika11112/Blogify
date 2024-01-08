import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ProfileDetails = ({setName}) => {

  const navigate = useNavigate();
  const URL = "http://localhost:5000/users"
  const [user, setUser] = useState({});
  const [changePass, setChangePass] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");

  const changeUserPass = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/changePass`, {
        status: "changePass",
        id: localStorage.getItem("userId"),
        oldPass,
        newPass,
        confirmPass
      });
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      if (error.response.status === 401) {
        navigate("/login");
      } else if (error.response.status === 400) {
        setError(error.response.data.error)
      }
    }
  }

  const getUserDetails = async () => {
    try {
      const response = await axios.post(`${URL}/getUser`, {
        id: localStorage.getItem("userId")
      });
      if (response.status === 200) {
        setUser(response.data.user);
        setName(response.data.user.name);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserDetails();
  }, [])

  return (
    user && !changePass ? <div className="flex justify-evenly h-full items-start flex-col gap-4">
      <p className="font-bold tracking-wider">Name - <span className="font-normal">{user.name}</span></p>
      <p className="font-bold tracking-wider">Username - <span className="font-normal">{user.username}</span></p>
      <p className="font-bold tracking-wider">Age - <span className="font-normal">{user.age}</span></p>
      <p className="font-bold tracking-wider">Blogs Posted - <span className="font-normal">{user.totalBlogs}</span></p>
      <div className="flex gap-4">
        <button onClick={() => setChangePass(true)} className="text-[blue] text-sm tracking-wider hover:underline">Change Password</button>
        <button className="text-[blue] text-sm tracking-wider hover:underline">Delete my account</button>
      </div>
    </div> :
      <div>
        <button onClick={() => setChangePass(false)} className="text-sm tracking-wider flex gap-[2px] text-[blue] items-center"><ArrowBackIcon style={{fontSize:14}} />Back</button>
        <form onSubmit={changeUserPass} className="flex flex-col justify-evenly h-full items-center gap-4">
          <h2 className="font-bold tracking-wider">Change Password</h2>
          <input value={oldPass} onChange={(e) => setOldPass(e.target.value)} type="password" placeholder="Old Password" className="tracking-wider text-sm border-2 p-1 rounded-md focus:outline-none" />
          <input value={newPass} onChange={(e) => setNewPass(e.target.value)} type="password" placeholder="New Password" className="tracking-wider text-sm border-2 p-1 rounded-md focus:outline-none" />
          <input value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} type="password" placeholder="Confirm Password" className="tracking-wider text-sm border-2 p-1 rounded-md focus:outline-none" />
          <p className="text-sm text-[red] tracking-wider">{error.length > 1 && "*"} {error}</p>
          <button className="bg-[red] text-white px-2 py-1 rounded-sm tracking-wider text-sm">Confirm changes</button>
        </form>
      </div>
  )
}

export default ProfileDetails