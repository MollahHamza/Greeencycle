import React, { useState } from "react";

const ReportForm = () => {
  const [wasteType, setWasteType] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Failed to get location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!wasteType || !location || !description || !latitude || !longitude) {
      alert("Please fill in all fields and allow location access.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("wasteType", wasteType);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:5000/submit-report", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Waste report submitted successfully.");
        setWasteType("");
        setLocation("");
        setDescription("");
        setLatitude(null);
        setLongitude(null);
        setImage(null);
        setImagePreview("");
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Report Waste</h2>

      <label className="block mb-2">Waste Type</label>
      <input
        type="text"
        value={wasteType}
        onChange={(e) => setWasteType(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />

      <label className="block mb-2">Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />

      <button type="button" onClick={getLocation} className="w-full py-2 bg-blue-500 text-white rounded-md mb-4">
        Get Current Location
      </button>
      {latitude && longitude && (
        <p className="text-sm text-gray-600">Location: {latitude}, {longitude}</p>
      )}

      <label className="block mb-2">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      ></textarea>

      <label className="block mb-2">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />

      {imagePreview && (
        <div className="image-preview mb-4">
          <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md" />
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-green-500 text-white rounded-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
};

export default ReportForm;
