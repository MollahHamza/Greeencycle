import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import WasteForecast from '../components/WasteForecast';

const DashboardPage = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch waste report locations from the backend
    const fetchReports = async () => {
      try {
        const response = await fetch('http://localhost:5000/reports'); // Correct endpoint to fetch reports
        const data = await response.json();

        console.log("Fetched reports:", data); // Debugging step to check the fetched data
        
        // Ensure locations have lat/lng before setting state
        const mappedData = data
          .filter(report => report.latitude && report.longitude) // Check for valid latitude/longitude
          .map(report => ({
            id: report.id,
            lat: report.latitude,
            lng: report.longitude,
            description: report.description,
          }));

        console.log("Mapped locations:", mappedData); // Debugging mapped data
        setLocations(mappedData); // Update the state with mapped locations
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);

  // Create a huge red dot as the marker
  const redDotIcon = new L.DivIcon({
    className: 'leaflet-div-icon',
    html: '<div style="background-color: red; width: 30px; height: 30px; border-radius: 50%;"></div>',
    iconSize: [30, 30],
    iconAnchor: [15, 15], // To center the dot on the marker position
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Municipal Dashboard</h2>

      {/* Map Container */}
      <div className="mb-6">
        <MapContainer
          center={[23.8103, 90.4125]} // Default location (Dhaka, Bangladesh)
          zoom={12}
          style={{ height: "400px", width: "100%" }}
        >
          {/* OpenStreetMap Tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Markers for waste locations */}
          {locations.map(({ id, lat, lng, description }) => (
            <Marker key={id} position={[lat, lng]} icon={redDotIcon}>
              <Popup>{description}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Waste Forecast Section */}
      <WasteForecast />
    </div>
  );
};

export default DashboardPage;
