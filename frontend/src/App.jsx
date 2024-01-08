import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import AddBlog from "./components/AddBlog";
import { useState } from "react";
import EditBlog from "./components/EditBlog";
import UserProfile from "./components/UserProfile";
import UserBlogs from "./components/UserBlogs";

function App() {

  const [userId, setUserId] = useState();
  const [blogId, setBlogId] = useState(null);
  const [filter, setFilter] = useState("");
  const [sortOrder, setSortOrder] = useState(false);

  return (
    <>
      <header>
        <Navbar userId={userId} />
      </header>

      <main>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/" element={<Home setSortOrder={setSortOrder} sortOrder={sortOrder} setFilter={setFilter} filter={filter} userId={userId} setBlogId={setBlogId} setUserId={setUserId} />} />
          <Route exact path="/addBlog" element={<AddBlog setUserId={setUserId} />} />
          <Route exact path="/editBlog" element={<EditBlog blogId={blogId} />} />
          <Route exact path="/profile" element={<UserProfile setUserId={setUserId} />} />
          <Route exact path="/userBlogs" element={<UserBlogs setSortOrder={setSortOrder} sortOrder={sortOrder} setFilter={setFilter} filter={filter} userId={userId} setBlogId={setBlogId} setUserId={setUserId} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;