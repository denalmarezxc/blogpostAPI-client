import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom';


import UserContext from '../context/UserContext';
import {useState, useEffect, useContext} from 'react';


export default function ViewPost(){
    const {user} = useContext(UserContext);
    const [posts, setPosts] = useState({});
    const { postId } = useParams();

    // console.log(postId)

    const fetchData = () => {
        let fetchUrl = `https://blogpostapi-server.onrender.com/posts/view-post/${postId}`;

        fetch(fetchUrl, {
            headers : {
                'Authorization' : `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {
            
            // console.log(data);
            setPosts(data);

        });
    }

    useEffect(() => {
        fetchData();

    }, []);




    return (
        <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          {/* Blog Post Card */}
          <Card className="mb-4 shadow-sm">
            <Card.Img
              variant="top"
              src="https://via.placeholder.com/800x300.png?text=Blog+Image"
              alt="Blog Post Image"
              style={{ objectFit: "cover", height: "300px" }}
            />
            <Card.Body>
              <Card.Title className="text-center mb-4">{posts.title || "No Title Available"}</Card.Title>
              <Card.Text>
                {posts.content || "No content to display for this post."}
              </Card.Text>
              <div className="d-flex justify-content-between text-muted">
                <small> {posts.author ? `posted by: ${posts.author}` : "Unknown"}</small>
                <small>{posts.createdOn
                 ? `Created On: ${new Date(posts.createdOn).toISOString().split("T")[0]}`
                : "Creation date not available"}</small>
              </div>
            </Card.Body>
          </Card>

          {/* Comment Section */}
          <Card>
            <Card.Body>
              <Card.Title>Comments</Card.Title>

              {/* Placeholder Comments */}
              <div className="mb-3">
                <p className="mb-1">
                  <strong>User 1:</strong> Great post! Really informative.
                </p>
                <hr />
                <p className="mb-1">
                  <strong>User 2:</strong> I enjoyed reading this. Keep it up!
                </p>
                <hr />
              </div>

              {/* Comment Form */}
              <Form>
                <Form.Group controlId="commentTextarea">
                  <Form.Label>Leave a Comment</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Write your comment here..." />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Submit Comment
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    )
}