import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppNavBar from "./components/AppNavBar";
import Registration from "./pages/Registration";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import BlogPosts from "./pages/BlogPosts";
import ViewPost from "./components/ViewPost";
import MyPosts from "./pages/MyPosts";


import { UserProvider } from './context/UserContext';
import {useState, useEffect} from 'react';

import { Container } from 'react-bootstrap';
import AdminDashboard from './pages/AdminDashoard';

function App() {
  const [user, setUser] = useState({
    id: null,
    isAdmin: null
  })

  function unsetUser(){
    localStorage.clear();
  }

  useEffect(()=> {
    //fetch to retrieve the user details
  
  if(localStorage.getItem('token')){
      fetch('https://blogpostapi-server.onrender.com/users/details', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);

          if(data._id === undefined){
            setUser({
              id:null,
              isAdmin: null
            })
          }else{
            setUser({
              id: data._id,
              isAdmin: data.isAdmin
            })
          }
      })

  }else{
    setUser({
      id: null,
      isAdmin: null
    })
    
  }

}, [])


  return(
    <>
      <UserProvider value = {{user, setUser, unsetUser}}>
        <Router>
          <AppNavBar/>
          <Container>
            <Routes>
              <Route path="/" element={<Home />} /> 
              <Route path="/register" element={<Registration />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/blog-post" element={<BlogPosts />} />
              <Route path="/get-Myposts" element={<MyPosts />} />
              <Route path="/view-post/:postId" element={<ViewPost />} />
              <Route path="/adminDashboard" element={<AdminDashboard />} />
              
              
            </Routes>
          </Container>
        </Router>
      </UserProvider>
    </>
  )
}

export default App;
