// src/api.js
import Airtable from 'airtable';

const base = new Airtable({ apiKey: process.env.REACT_APP_AIRTABLE_API_KEY }).base(process.env.REACT_APP_AIRTABLE_BASE_ID);

export const createReport = async (data) => {
  try {
    const records = await base(process.env.REACT_APP_AIRTABLE_TABLE_NAME).create([
      {
        fields: {
          WasteType: data.wasteType,
          Location: data.location,
          Description: data.description,
          Image: data.image ? [{ url: URL.createObjectURL(data.image) }] : [], // You can replace this with actual image upload logic
        },
      },
    ]);
    return records;
  } catch (error) {
    console.error('Error creating report:', error);
  }
};
