// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Welcome to GreenCycle</h2>
    <p className="mb-4">Join us in making cities cleaner and greener!</p>
    <Link to="/report" className="bg-green-500 text-white py-2 px-4 rounded-md mr-4">Report Waste</Link>
    <Link to="/dashboard" className="bg-green-500 text-white py-2 px-4 rounded-md">View Dashboard</Link>
  </div>
);

export default HomePage;
