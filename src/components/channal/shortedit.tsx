"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function ShortEditForm() {
  const [shortsDetails, setshortsDetails] = useState(null);
  const { shortsId } = useParams();

  console.log("shortsId:", shortsId);

  useEffect(() => {
    const fetchVideoById = async () => {
      if (!shortsId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/short/${shortsId}`);
        setshortsDetails(response.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
        setshortsDetails(null);
      }
    };

    fetchVideoById();
  }, [shortsId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setshortsDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/updateShortsDetails/${shortsId}`, shortsDetails);
      alert("Video details updated successfully!");
    } catch (error) {
      console.error("Error updating video details:", error);
    }
  };

  if (!shortsDetails) return <p>Loading..jkjkjjkkkjkj.</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Section */}
      <div className="w-1/2 p-8 bg-white border-r-2">
        <h1 className="text-2xl font-bold mb-4">Edit Video Details</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={shortsDetails.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={shortsDetails.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>

          {/* Audience */}
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="audience">
              Audience
            </label>
            <select
              id="audience"
              name="audience"
              value={shortsDetails.audience}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Unlisted">Unlisted</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="w-1/2 p-8 bg-white">
        <h2 className="text-xl font-bold mb-4">Video Preview</h2>
        
        {/* Video Player */}
        <div className="mb-4">
          <video
            controls
            className="w-full rounded"
            src={shortsDetails.videoUrl}
            type="video/mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Video Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Video Name</label>
          <p className="text-gray-700">{shortsDetails.title}</p>
        </div>

        {/* Video URL */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="videoUrl">
            Video URL
          </label>
          <input
            type="text"
            id="videoUrl"
            name="videoUrl"
            value={shortsDetails.videoUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Visibility */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={shortsDetails.visibility}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="Public">Public</option>
            <option value="Private">Private</option>
            <option value="Unlisted">Unlisted</option>
          </select>
        </div>
      </div>
    </div>
  );
}
