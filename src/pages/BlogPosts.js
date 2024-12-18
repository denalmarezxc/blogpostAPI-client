import UserContext from '../context/UserContext';
import {useState, useEffect, useContext} from 'react';
import { Navigate, useNavigate , Link} from 'react-router-dom';

import {Container, Row, Col, Card, Button} from 'react-bootstrap';




export default function BlogPosts(){

    const {user} = useContext(UserContext);
    const navigate = useNavigate(); 
    // console.log(user);
    const [posts, setPosts] = useState([]);

    const fetchData = () => {
        let fetchUrl = "https://blogpostapi-server.onrender.com/posts/get-posts";

        fetch(fetchUrl, {
            headers : {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            
            console.log(data);
            setPosts(data);

        });
    }

    useEffect(() => {
        fetchData();

    }, []);




    return(
        <>
            <div className="container mt-2 d-flex flex-column justify-content-center align-items-center">
            <h1>BLOG POSTS</h1>
            <Row>
                
                {posts.length > 0 ?
                    (posts.map((post, index) => (

                        <Col key={index} sm={12} md={6} >
                            <Card className="mb-4">
                                <Card.Header className='text-center'>-- {post.author} --</Card.Header>
                                <Card.Body>
                                <Card.Title  className='text-center'>{post.title}</Card.Title>
                                <Card.Text>
                                {post.content.length > 100 
                                ? `${post.content.slice(0, 100)}...` 
                                : post.content}
                                </Card.Text>
                                
                                </Card.Body>
                                <Card.Footer className="text-muted">Date Posted: {new Date(post.createdOn).toISOString().split('T')[0]} <Link className="btn btn-dark float-end" to = {`/view-post/${post._id}`}>View Details</Link></Card.Footer>
                            </Card>
                        </Col>
                    ) ))
                :
                (
                    <p>No posts found</p>
                    )
                }
            </Row>

            </div>
        </>
    )
}