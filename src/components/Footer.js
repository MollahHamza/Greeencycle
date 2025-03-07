// src/components/Footer.js
import React from 'react';

const Footer = () => (
  <footer className="bg-green-500 text-white py-6 mt-auto">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-lg font-semibold">&copy; 2025 GreenCycle</p>
          <p className="text-sm">All Rights Reserved.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-green-200 transition-colors duration-300">Privacy Policy</a>
          <a href="#" className="hover:text-green-200 transition-colors duration-300">Terms of Service</a>
          <a href="#" className="hover:text-green-200 transition-colors duration-300">Contact</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
  