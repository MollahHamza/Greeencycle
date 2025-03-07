// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-green-500 p-4 text-white">
    <h1 className="text-xl font-bold">GreenCycle</h1>
    <nav className="mt-2">
      <Link className="mr-4 text-white hover:text-gray-200" to="/">Home</Link>
      <Link className="mr-4 text-white hover:text-gray-200" to="/report">Report Waste</Link>
      <Link className="text-white hover:text-gray-200" to="/dashboard">Dashboard</Link>
    </nav>
  </header>
);

export default Header;
