import React from 'react';
import { Link } from 'react-router-dom';  // If you're using React Router

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-600 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">MoMo Dashboard</h2>
      <ul>
        <li><Link to="/transactions">Transactions</Link></li>
        <li><Link to="/summary">Summary</Link></li>
        <li><Link to="/analytics">Analytics</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
