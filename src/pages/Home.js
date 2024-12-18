
import UserContext from '../context/UserContext';
import { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';


export default function Home(){
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();
    return (
    <>
        <div className="d-flex mt-5 flex-column justify-content-center align-items-center" >

        
             
                <h1>Welcome to Zuitt Blog Post</h1> 
                <p> Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."  </p>

                {(user.id !== null)?
                    (user.isAdmin)?
                    <Navigate to='/adminDashboard'/>
                    :
                    <Button onClick={() => navigate('/blog-post')}>Go to Blog Posts</Button>
                :
                <a href="/login">Login to get started</a>}

             
             
        </div>
    </>
    )
}