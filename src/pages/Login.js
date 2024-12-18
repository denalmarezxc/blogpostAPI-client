import { useState, useEffect, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

import UserContext from '../context/UserContext';

import {Notyf} from 'notyf';

export default function Login(){
    const {user, setUser} = useContext(UserContext);

    const notyf = new Notyf();

    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [isActive, setIsActive] = useState(true);

    function authenticate(e) {

        // Prevents page redirection via form submission
        e.preventDefault();
        fetch('https://blogpostapi-server.onrender.com/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({

                email: email,
                password: password

            })
        })
        .then(res => res.json())
        .then(data => {

            if(data.access){

                // console.log(data.access);
                localStorage.setItem('token', data.access);

                retrieveUserDetails(data.access);

                // Clear input fields after submission
                setEmail('');
                setPassword('');



                notyf.success('Successful Login');
            
            } else if (data.message == "Incorrect email or password") {

               notyf.error(`Incorrect credentials. Try again!`);

            } else {

                notyf.error(`${email} does not exist`);
            }

        })

    }

    function retrieveUserDetails(token){
       

        fetch('https://blogpostapi-server.onrender.com/users/details', 
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            setUser({
                id: data._id,
                isAdmin: data.isAdmin
            })
        })
    }


    useEffect(() => {

        // Validation to enable submit button when all fields are populated and both passwords match
        if(email !== '' && password !== ''){
            setIsActive(true);
        }else{
            setIsActive(false);
        }

    }, [email, password]);


    return (
        (user.id !== null)?
        <Navigate to='/'/>
        :
        <Form className='d-flex flex-column justify-content-center mt-5'
            onSubmit = {event => authenticate(event)}>
                <h1 className='text-center'>Login</h1>
                <Form.Group className="mb-3" >
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="name@example.com" 
                value = {email}
                onChange = {event => setEmail(event.target.value)}
                required/>
                </Form.Group>

                <Form.Group className="mb-3" >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Enter your password" 
                value = {password}
                onChange = {event => setPassword(event.target.value)}
                required/>
                </Form.Group>


                {
		      	isActive ?
		      		<Button variant="primary" type="submit" >
		      		  Login
		      		</Button>
		      	:
		      		<Button variant="danger" type="submit" disabled>
		        		Login
		      		</Button>
		        }
                
                
            </Form>
    )
}