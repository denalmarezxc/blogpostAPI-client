import {Container , Nav, Navbar} from 'react-bootstrap';
import {NavLink } from 'react-router-dom';
import { useState, useContext } from 'react';

import UserContext from '../context/UserContext';


export default function AppNavBar(){
  const {user} = useContext(UserContext);
  // console.log(user)

    return(
      <>
        <Navbar expand="lg" data-bs-theme="dark" className="bg-body-tertiary">
          <Container>
            <Navbar.Brand href="/"> Zuitt Book</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto me-5">

                  
                  {
                    (user.id !== null)?
                      (user.isAdmin)?
                      <>
                        <Nav.Link as={NavLink} to="/adminDashboard" exact="true" >Admin DashBoard</Nav.Link>
                        <Nav.Link as={NavLink} to="/blog-post" exact="true" >Blog Posts</Nav.Link>
                        <Nav.Link as={NavLink} to="/logout" exact="true" >Logout</Nav.Link>
                      </>
                      :
                      <>
                        <Nav.Link as={NavLink} to="/" exact="true" >Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/blog-post" exact="true" >Blog Posts</Nav.Link>
                        <Nav.Link as={NavLink} to="/get-Myposts" exact="true" >My Posts</Nav.Link>
                        <Nav.Link as={NavLink} to="/logout" exact="true" >Logout</Nav.Link>
                        
                      </>
                    :
                    <>
                      <Nav.Link as={NavLink} to="/" exact="true" >Home</Nav.Link>
                      <Nav.Link as={NavLink} to="/blog-post" exact="true" >Blog Posts</Nav.Link>
                      <Nav.Link as={NavLink} to="/login" exact="true" >Login</Nav.Link>
                      <Nav.Link as={NavLink} to="/register" exact="true" >Register</Nav.Link>
                    </>
                  }
                  

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

      
      </>
    )
}