
import { Notyf } from 'notyf';

import {Form, Button} from 'react-bootstrap';
import {useState, useEffect, useContext} from 'react';
import {useNavigate} from 'react-router-dom';



export default function Registration(){
    const notyf = new Notyf();
    
    const [email, setEmail] = useState('');
    const [userName, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isActive, setIsActive] = useState('');

    const navigate = useNavigate();



    const registerUser = (event) =>{
        event.preventDefault();
        
        fetch('https://blogpostapi-server.onrender.com/users/register', {
			method: 'POST',
			headers: {
				"Content-Type" : 'application/json'
			},
			body: JSON.stringify({
				userName,
                email,
				password
			})
		})
        .then(response => response.json())
        .then(data => {
            console.log(data)
            
            if(data.message === 'Registered successfully'){
				
				setEmail('');
                setUsername('');
				setPassword('');
				setConfirmPassword('');

				notyf.success("Registration successful!");
                navigate('/login');
			}else {
				notyf.error("Something went wrong!");
			}
			
		})

	}


    useEffect(()=> {
		
		if(email !== "" && password === confirmPassword  ){
			setIsActive(true);
		}else{
			setIsActive(false);
		}
	
	}, [userName, email, password, confirmPassword])


    return (
        <>

            <Form className='d-flex flex-column justify-content-center mt-5'
            onSubmit = {event => registerUser(event)}>
                <h1 className='text-center'>Register</h1>

                <Form.Group className="mb-3" >
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="enter username" 
                value = {userName}
                onChange = {event => setUsername(event.target.value)}
                required/>
                </Form.Group>

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

                <Form.Group className="mb-3" >
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm your password" 
                value = {confirmPassword}
                onChange = {event => setConfirmPassword(event.target.value)}
                required/>
                </Form.Group>

                {
		      	isActive ?
		      		<Button variant="primary" type="submit" >
		      		  Register
		      		</Button>
		      	:
		      		<Button variant="danger" type="submit" disabled>
		        		Register
		      		</Button>
		        }
                
                
            </Form>
        </>
        
    )
}