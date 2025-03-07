// src/pages/DashboardPage.js
import React from 'react';
import WasteForecast from '../components/WasteForecast';

const DashboardPage = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Municipal Dashboard</h2>
    <WasteForecast />
  </div>
);

export default DashboardPage;
