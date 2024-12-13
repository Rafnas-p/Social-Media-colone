"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { UserAuth } from "@/context/authcontext/authcontext";

const CreateChannelForm: React.FC = () => {
  const { user } = UserAuth(); 
  const username = user?.displayName || ''; 

  const [channelName, setChannelName] = useState<string>(username);
  const [description, setDescription] = useState<string>('');
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('channelName', channelName);
    formData.append('description', description);
    if (profilePic) {
      formData.append('profilePic', profilePic);
    }

    console.log("Form submitted:", {
      channelName,
      description,
      profilePic,
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Create Your Channel</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-4">
          <label htmlFor="channelName" className="block text-sm font-medium text-gray-700 mb-2">
            Channel Name
          </label>
          <input
            type="text"
            id="channelName"
            name="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Channel Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="profilePic" className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture
          </label>
          <input
            type="file"
            id="profilePic"
            name="profilePic"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
          >
            Create Channel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateChannelForm;
