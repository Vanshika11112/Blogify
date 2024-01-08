import { useEffect, useState } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

    axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const URL = 'http://localhost:5000/users';
    const [login, setLogin] = useState(true);
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [age, setAge] = useState(18)
    const [error, setError] = useState("");

    const setLoginStatus = (value) => {
        setLogin(value)
        setName("");
        setUsername("");
        setPassword("");
        setError("");
    }

    const formSubmit = async (e) => {
        e.preventDefault();

        if (!login) {
            try {
                const response = await axios.post(`${URL}/signup`, {
                    name,
                    username,
                    password,
                    age
                });
                if (response.data.user) {
                    setError("");
                    setName("");
                    setUsername("");
                    setPassword("");
                    setLogin(true);
                }
            } catch (error) {
                setError(error.response.data.error)
            }
        } else {
            try {
                const response = await axios.post(`${URL}/login`, {
                    username,
                    password
                }, {
                    withCredentials: true
                });
                if (response.data.user) {
                    localStorage.setItem('userId', response.data.user._id);
                    navigate("/");
                }
            } catch (error) {
                setError(error.response.data.error)
            }
        }

    }

    const verifyToken = async () => {
        try {
            const response = await axios.post(`${URL}/verifyAccessToken`);
            if (response.data.id) {
                navigate("/");
            }
        } catch (error) {
            // console.log(error);
        }
    }

    useEffect(() => {
        // verifyToken();
    }, [])

    return (
        <form onSubmit={formSubmit} className="my-12 bg-white shadow-lg flex flex-col gap-6 items-start mx-auto rounded-md py-12 px-8 w-[90%] md:w-[35%]">
            <h2 className="font-bold select-none text-lg text-center w-full tracking-wider">{login ? "Login" : "Sign-Up"}</h2>
            <div className="flex flex-col items-start gap-6 w-full">
                {!login && <input className="border-b-2 tracking-wider w-full focus:outline-none" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} type="text" />}
                <input className="border-b-2 tracking-wider w-full focus:outline-none" placeholder="email" type="email" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="border-b-2 tracking-wider w-full focus:outline-none" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {!login && <div className="flex items-center w-full gap-2">
                    <p>Age: </p>
                    <input type="number" className="flex-1 focus:outline-none" min={18} max={100} value={age} onChange={(e) => setAge(e.target.value)} />
                </div>}
            </div>
            {error.length > 0 && <p className="text-[red] text-sm tracking-wider text-center w-full">{error}</p>}
            {login && <button className="focus:outline-none w-full select-none bg-[orange] py-1 text-white tracking-wider rounded-sm">Login</button>}
            {!login && <button className="focus:outline-none w-full select-none bg-[orange] py-1 text-white tracking-wider rounded-sm">Sign-Up</button>}
            {login && <p onClick={() => setLoginStatus(false)} className="text-[blue] select-none mx-auto cursor-pointer text-center text-sm">Dont have an account?</p>}
            {!login && <p onClick={() => setLogin(true)} className="text-[blue] select-none mx-auto cursor-pointer text-center text-sm">Have an account?</p>}
        </form>
    )
}

export default Login