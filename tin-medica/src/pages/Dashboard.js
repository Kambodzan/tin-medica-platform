import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => (
  <div className="dashboard">
    <h1>Dashboard</h1>
    <div className="sidebar-layout">
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/dashboard/option1">Option 1</Link></li>
            <li><Link to="/dashboard/option2">Option 2</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="main-content">
        <p>Select an option from the sidebar.</p>
      </main>
    </div>
  </div>
);

export default Dashboard;