import './App.css';
import { useState, useEffect } from 'react';
import { Button, Modal, Form, Card, Container } from 'react-bootstrap';
function App() {
  const [posts, setPosts] = useState([]);
  const [auth, setAuth] = useState(false);
  const [content, setContent] = useState('');
  const [loginName, setLoginName] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const response = await fetch('http://localhost:3000/posts',{credentials: 'include',});
    if (!response.ok) {
      setAuth(false);
      setPosts([]);
      return;
    }
    setAuth(true);
    const posts = await response.json();
    setPosts(posts);
  };

  const login = async (name) => {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: name,
      }),
    });
    setLoginName('');
    if (!response.ok) {
      setAuth(false);
      return;
    }
    setAuth(true);
    fetchPosts();
  };
  const logout = async () => {
    const response = await fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (!response.ok) {
      setAuth(true);
      return;
    }
    setAuth(false);
    fetchPosts();
  };

  const createPost = async () => {
    const response = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        content: content,
      }),
    });
    setContent('');
    if (!response.ok) {
      setAuth(false);
      return;
    }
    setAuth(true);
    fetchPosts();
  };

  const register = async () => {
    const response = await fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: registerName,
      }),
    });
    if (!response.ok) {
      setAuth(false);
      return;
    }
    setAuth(true);
    login(registerName);
    setRegisterName('');
  };

  const likePost = async (id) => {
    await fetch(`http://localhost:3000/posts/${id}/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    fetchPosts();

  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-light">
        <div className='ms-3'>
          {
            auth &&
            <>
              <Button variant='primary' className="me-3" onClick={() => setShowCreatePost(true)}>Create post</Button>
              <Modal show={showCreatePost} onHide={() => setShowCreatePost(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Create post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-2" >
                      <Form.Label>Content</Form.Label>
                      <Form.Control type="text" onChange={(e) => setContent(e.target.value)} />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='primary' onClick={() => { createPost(); setShowCreatePost(false); }}>Create</Button>
                </Modal.Footer>
              </Modal>
            </>
          }
          {
            auth && <Button variant='primary' onClick={logout}>Logout</Button>
          }
          {
            !auth &&
            <>
              <Button variant='primary' className="me-2" onClick={() => setShowLogin(true)}>Login</Button>
              <Modal show={showLogin} onHide={() => setShowLogin(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-2" >
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" onChange={(e) => setLoginName(e.target.value)} />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='primary' onClick={() => { login(loginName); setShowLogin(false); }}>Login</Button>
                </Modal.Footer>
              </Modal>
            </>

          }
          {
            !auth &&
            <>
              <Button variant="primary" onClick={() => setShowRegister(true)}>Register</Button>
              <Modal show={showRegister} onHide={() => setShowRegister(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Register</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Group className="mb-2" >
                      <Form.Label>Name</Form.Label>
                      <Form.Control type="text" onChange={(e) => setRegisterName(e.target.value)} />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant='primary' onClick={() => { register(); setShowRegister(false); }}>Register</Button>
                </Modal.Footer>
              </Modal>
            </>
          }
        </div>
      </nav>
      <div>
        <Container>

              <div className="d-flex flex-column justify-content-center">
                <h1 className="mt-4">Posts</h1>
                {
                  posts?.length > 0 ?  
                  posts.map(post => (
                    <Card className="mt-4" key={post.id}>
                      <Card.Body>
                        <Card.Title >{post.userName}</Card.Title> 
                        <Card.Text>{post.content}</Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          <Button variant='primary' className="me-3" onClick={() => likePost(post.id)}>Like</Button>
                          <p>{post.likes} likes</p>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                  : <div className="mt-4">No posts found</div>
                }
              </div>
        </Container>
      </div>
    </div>
  );
}

export default App;
