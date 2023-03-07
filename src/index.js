import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Navbar, Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import App from './App';

const root = createRoot(document.getElementById('root'));

root.render(
  <>
    <Navbar bg="light" expand="lg" className="mb-5">
      <Container>
        <Navbar.Brand href="/">Top Podcasts</Navbar.Brand>
      </Container>
    </Navbar>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);
