"use client";
import React, { useState } from "react";
import { UserAuth } from "@/context/authcontext/authcontext";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ChannelData {
  name: string;
  _id: string;
  photoURL: string;
  handil: string;
}

const CreateChannelForm: React.FC = () => {
  const { user } = UserAuth();
  const router = useRouter(); // Initialize useRouter

  const [channelData, setChannelData] = useState<ChannelData>({
    name: user?.displayName || "", 
    _id: user?._id || "", 
    photoURL: user?.photoURL || "", 
    handil: `@${user?.displayName || ""}`.trim(), 
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string>(user?.photoURL || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChannelData((prevData) => ({
      ...prevData,
      [name]: name === "handil" ? value.trim() : value, 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileURL = URL.createObjectURL(file);
      setPreviewImage(fileURL); 
      setChannelData((prevData) => ({
        ...prevData,
        photoURL: fileURL, 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const formData = new FormData();

    const fileInput = document.querySelector<HTMLInputElement>("input[type='file']");
    if (fileInput?.files?.[0]) {
      formData.append("image", fileInput.files[0]); 
    }

    formData.append("name", channelData.name);
    formData.append("userId", channelData._id);
    formData.append("handil", channelData.handil);
  formData.append("photoURL",channelData.photoURL)
    const response = await axios.post("http://localhost:5000/api/create-channel", formData, {
      headers: {
        "Content-Type": "multipart/form-data", 
      },
    });

    setMessage(response.data.message);
    router.push("/");
  } catch (error: any) {
    setMessage(error.response?.data?.message || "Something went wrong!");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded-md shadow-md bg-white">
      <h1 className="text-lg font-bold mb-4">
        {channelData.name ? "Edit Channel" : "Create Channel"}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 text-center">
          <img
            src={previewImage || channelData.photoURL}
            alt="User"
            className="w-24 h-24 rounded-full mx-auto mb-3"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block mx-auto text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="name" className="block font-semibold mb-1">
            Channel Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={channelData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="handil" className="block font-semibold mb-1">
            Handle:
          </label>
          <input
            type="text"
            id="handil"
            name="handil"
            value={channelData.handil}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <input type="hidden" name="_id" value={channelData._id} />

        <button
          type="submit"
          className={`w-full py-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"} text-white font-bold`}
          disabled={loading}
        >
          {loading ? "Saving..." : channelData.name ? "Create Channel" : "Create Channel"}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default CreateChannelForm;
