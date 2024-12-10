"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface VideoDetails {
  title: string;
  description: string;
  audience: string;
  videoUrl: string;
  visibility: string;
}

export default function EditForm() {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null); 
  const { videoId } = useParams<{ videoId: string }>(); 
  console.log("videoId:", videoId);

  useEffect(() => {
    const fetchVideoById = async () => {
      if (!videoId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/video/${videoId}`);
        setVideoDetails(response.data);
      } catch (error) {
        console.error("Error fetching video details:", error);
        setVideoDetails(null);
      }
    };

    fetchVideoById();
  }, [videoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setVideoDetails((prevDetails) => (prevDetails ? { ...prevDetails, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoDetails) {
      try {
        await axios.put(`http://localhost:5000/api/updateVideoDetails/${videoId}`, videoDetails);
        alert("Video details updated successfully!");
      } catch (error) {
        console.error("Error updating video details:", error);
      }
    }
  };

  if (!videoDetails) return <p>Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <div className="w-1/2 p-8 bg-white border-r-2">
        <h1 className="text-2xl font-bold mb-4">Edit Video Details</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={videoDetails.title}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={videoDetails.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2" htmlFor="audience">
              Audience
            </label>
            <select
              id="audience"
              name="audience"
              value={videoDetails.audience}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Unlisted">Unlisted</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
        </form>
      </div>

      <div className="w-1/2 p-8 bg-white">
        <h2 className="text-xl font-bold mb-4">Video Preview</h2>
        
        <div className="mb-4">
          <video
            controls
            className="w-full rounded"
            src={videoDetails.videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Video Name</label>
          <p className="text-gray-700">{videoDetails.title}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="videoUrl">
            Video URL
          </label>
          <input
            type="text"
            id="videoUrl"
            name="videoUrl"
            value={videoDetails.videoUrl}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={videoDetails.visibility}
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
