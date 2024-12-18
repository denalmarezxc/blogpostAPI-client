import React, { useState, useEffect, useContext } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { useParams } from 'react-router-dom';
import '../index.css'
export default function MyPosts() {
  const { postId } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false); 
  const [currentPost, setCurrentPost] = useState({}); 
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');


  const [showAddModal, setShowAddModal] = useState(false); // Modal state for adding post

   // States for creating new post
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

    const fetchData = () => {
        let fetchUrl = "https://blogpostapi-server.onrender.com/posts/get-Myposts";

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


     // Show Edit Modal
  const handleEdit = (post) => {
    setCurrentPost(post);
    setUpdatedTitle(post.title);
    setUpdatedContent(post.content);
    setShowModal(true);
  };

  // Update Post
  const handleUpdate = () => {
    const fetchUrl = `https://blogpostapi-server.onrender.com/posts/edit-post/${currentPost._id}`;

    fetch(fetchUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowModal(false);
        fetchData(); // Refresh the posts
      });
  };

  // Delete Post
  const handleDelete = (postId) => {
    const fetchUrl = `https://blogpostapi-server.onrender.com/posts/delete-post/${postId}`;

    fetch(fetchUrl, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        fetchData(); // Refresh the posts
      });
  };

  // Add new post
  const handleAddPost = () => {
    const fetchUrl = "https://blogpostapi-server.onrender.com/posts/add-post";

    fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title: newTitle, content: newContent }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowAddModal(false);
        fetchData(); // Refresh the posts
      });
  };


    return(
        <>
            <div className="container mt-2 d-flex flex-column justify-content-center align-items-center">
            <h1>BLOG POSTS</h1>

            {/* Button to open Add Post Modal */}
            <Button variant="success" onClick={() => setShowAddModal(true)} className="mb-4">
            Add Post
            </Button>

            <Row>
                
                {posts.length > 0 ?
                    (posts.map((post, index) => (

                        <Col key={index} sm={12} md={6} >
                            <Card className="card-post mb-4">
                                <Card.Header className='text-center'>-- {post.author} --</Card.Header>
                                <Card.Body>
                                <Card.Title  className='text-center'>{post.title}</Card.Title>
                                <Card.Text>
                                {post.content.length > 100 
                                ? `${post.content.slice(0, 100)}...` 
                                : post.content}
                                </Card.Text>
                                
                                </Card.Body>
                                
                                <Card.Footer className="text-muted text-center">
                                  
                                  <span >Date Posted: {new Date(post.createdOn).toISOString().split('T')[0]} </span>
                                  
                                  
                                  
                                  <div className='mt-2'>
                                    <Link className="me-2 btn btn-dark " to = {`/view-post/${post._id}`}>View Details </Link>
                                    <Button
                                        variant="info"
                                        size="md"
                                        className="me-2"
                                        onClick={() => handleEdit(post)}
                                        >
                                        Edit
                                        </Button>
                                        <Button
                                        variant="danger"
                                        size="md"
                                        onClick={() => handleDelete(post._id)}
                                        >
                                        Delete
                                    </Button>
                                  </div>
                                  
                                
                                </Card.Footer>

                                
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

             {/* Modal for Editing Post */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                <Modal.Title>Edit Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form>
                    <Form.Group controlId="formPostTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                    </Form.Group>
                    <Form.Group controlId="formPostContent" className="mt-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={updatedContent}
                        onChange={(e) => setUpdatedContent(e.target.value)}
                    />
                    </Form.Group>
                </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>

             {/* Modal for Adding Post */}
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Add New Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewPostTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        </Form.Group>
                        <Form.Group controlId="formNewPostContent" className="mt-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                        />
                        </Form.Group>
                    </Form>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddPost}>
                        Add Post
                    </Button>
                    </Modal.Footer>
                </Modal>
        </>
    )
}