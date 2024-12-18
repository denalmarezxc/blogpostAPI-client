import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import { useState, useContext, useEffect } from 'react';

export default function AdminDashboard() {
  const { user } = useContext(UserContext);  // Get user from context
  const [posts, setPosts] = useState([]);
  const notyf = new Notyf();

  const [showModal, setShowModal] = useState(false); 
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: user.username, // Set the default author to the logged-in user's username
  });
  const [editingPostId, setEditingPostId] = useState(null); // Track the post being edited

  // Fetch posts data from API
  const fetchData = () => {
    fetch('https://blogpostapi-server.onrender.com/posts/get-posts', {
      headers: {
        "Content-Type": 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setPosts(data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle modal open/close
  const handleShowModal = (post = null) => {
    if (post) {
      // If post is passed, it's for editing, so pre-fill the form
      setNewPost({
        title: post.title,
        content: post.content,
        author: post.author,
      });
      setEditingPostId(post._id); // Set the post ID being edited
    } else {
      // Reset the form for adding a new post
      setNewPost({
        title: '',
        content: '',
        author: user.username,
      });
      setEditingPostId(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPostId(null); // Clear editing state when closing modal
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  // Submit new post to API (Add Post)
  const handleAddPost = () => {
    fetch('https://blogpostapi-server.onrender.com/posts/add-post', {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(newPost),
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          // Refresh posts list and close modal
          notyf.success('Post successfully added');
          fetchData();
          handleCloseModal();
        } else {
          notyf.error('Failed to add post');
        }
      })
      .catch(err => console.error('Error adding post:', err));
  };

  // Update post (Edit Post)
  const handleUpdate = () => {
    const fetchUrl = `https://blogpostapi-server.onrender.com/posts/edit-post/${editingPostId}`;

    fetch(fetchUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ title: newPost.title, content: newPost.content }),
    })
      .then((res) => res.json())
      .then(() => {
        setShowModal(false);
        fetchData(); // Refresh the posts
        notyf.success('Post successfully updated');
      })
      .catch((err) => {
        notyf.error('Failed to update post');
        console.error('Error updating post:', err);
      });
  };

  // Delete post
  const handleDeletePost = (postId) => {
    fetch(`https://blogpostapi-server.onrender.com/posts/delete-post/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        if (data) {
          fetchData(); // Refresh the posts
          notyf.success('Post successfully deleted');
        } else {
          notyf.error('Failed to delete post');
        }
      })
      .catch(err => console.error('Error deleting post:', err));
  };

  return (
    (user.isAdmin) ? (
      <>
        <div className='my-3 d-flex flex-column justify-content-center align-items-center'>
          <h1>ADMIN DASHBOARD</h1>
          <Button variant="primary" onClick={() => handleShowModal()}>Add Post</Button>
        </div>

        <Table striped bordered hover>
            <thead className='text-center'>
                <tr>
                <th>#</th>
                <th>Title</th>
                <th>Author</th>
                <th>Content</th>
                <th>Created On</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>{post.content.slice(0, 100)}...</td> {/* Show a truncated version of the content */}
                    <td>{new Date(post.createdOn).toISOString().split('T')[0]}</td>
                    <td className='d-flex gap-2'>
                        {(user.isAdmin) && (
                        <Button variant="dark" onClick={() => handleShowModal(post)}>Edit</Button>
                        )}
                        {user.isAdmin && (
                        <Button variant="danger" onClick={() => handleDeletePost(post._id)}>Delete</Button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </Table>

        {/* Add or Edit Post Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{editingPostId ? 'Edit Post' : 'Add New Post'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formPostTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter post title"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              {/* Removed author field from the form */}
              <Form.Group className="mb-3" controlId="formPostContent">
                <Form.Label>Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter post content"
                  name="content"
                  value={newPost.content}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={editingPostId ? handleUpdate : handleAddPost}>
              {editingPostId ? 'Update Post' : 'Add Post'}
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    ) : (
      <Navigate to="/" />
    )
  );
}
