// pages/test.tsx
"use client"
import React, { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../utils/youtubeApi'; // Adjust the path as needed

const TestPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchDataFromApi(); // Call the API function
      setData(response);
    };
    fetchData();
  }, []);

  console.log(data); // Log the data to inspect the structure
  
  return (
    <div>
      <h1>API Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display the fetched data */}
    </div>
  );
};

export default TestPage;
