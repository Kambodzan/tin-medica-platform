import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => (
  <div className="homepage">
    <h1>Welcome to the Homepage</h1>
    <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link>
    </nav>
  </div>
);

export default Homepage;