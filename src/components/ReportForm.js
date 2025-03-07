import React, { useState } from 'react';
import Airtable from 'airtable';

const ReportForm = () => {
  const [wasteType, setWasteType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Store base64 image preview
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!wasteType || !location || !description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Airtable credentials and base setup
      const apiKey = process.env.REACT_APP_AIRTABLE_API_KEY;
      const baseId = process.env.REACT_APP_AIRTABLE_BASE_ID;
      const tableName = process.env.REACT_APP_AIRTABLE_TABLE_NAME;

      const base = new Airtable({ apiKey }).base(baseId);

      // Prepare record without the image first
      const recordData = {
        WasteType: wasteType,
        Location: location,
        Description: description,
      };

      // If there's an image, prepare it for Airtable
      if (image) {
        // Convert the image to base64 for Airtable
        const base64Image = await convertFileToBase64(image);
        
        // Add image attachment to record data following Airtable's format
        recordData.Image = [
          {
            url: `data:${image.type};base64,${base64Image}`,
            filename: image.name,
            type: image.type
          }
        ];
      }

      // Create the record in Airtable
      await base(tableName).create([
        {
          fields: recordData,
        },
      ]);

      // Display success message
      alert('Waste report submitted successfully.');
      
      // Reset form fields
      setWasteType('');
      setLocation('');
      setDescription('');
      setImage(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // The result includes the data URI scheme (e.g., "data:image/jpeg;base64,"),
        // which we need to strip off
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Report Waste</h2>

      {/* Waste Type */}
      <label className="block mb-2">Waste Type</label>
      <input
        type="text"
        value={wasteType}
        onChange={(e) => setWasteType(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />

      {/* Location */}
      <label className="block mb-2">Location</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      />

      {/* Description */}
      <label className="block mb-2">Description</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
        required
      ></textarea>

      {/* Image Upload */}
      <label className="block mb-2">Upload Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      
      {/* Image Preview */}
      {imagePreview && (
        <div className="image-preview mb-4">
          <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-md" />
        </div>
      )}

      {/* Submit Button */}
      <button 
        type="submit" 
        className="w-full py-2 bg-green-500 text-white rounded-md"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </button>
    </form>
  );
};

export default ReportForm;