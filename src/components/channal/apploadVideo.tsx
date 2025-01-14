"use client";
import React, { useState, ChangeEvent, FormEvent, useContext } from "react";
import axios from "axios";
import { MyContext } from "@/context/vidoContext/VideoContext";
import Image from "next/image";
const VideoUploadComponent: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("video");
  const context = useContext(MyContext);
  if (!context) {
    return <div>Loading...</div>;
  }
  const { channels } = context;
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setVideoFile(selectedFile);
      setVideoUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (
    e: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setDescription(e.target.value);
  };

  const handleUpload = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("description", description);
    formData.append("userId", channels?.userId ?? "");
    formData.append("userName", channels?.name ?? "");
    formData.append("channelId", channels?._id ?? "");
    formData.append("title", title);
    formData.append("category", category);

    try {
      const response = await axios.post<{ thumbnailPath: string }>(
        "https://your-video-platform.onrender.com/api/videos/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            }
          },
        }
      );

      setThumbnail(response.data.thumbnailPath);
      setVideoFile(null);
      setDescription("");
      setTitle("");
      setCategory("video");
      setVideoUrl(null);
      alert("Video uploaded successfully!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Server Error:", error.response?.data);
        alert(`Error: ${error.response?.data.message || "Upload failed"}`);
      } else if (error instanceof Error) {
        console.error("Upload Error:", error.message);
        alert("An unexpected error occurred. Please try again.");
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-brmt-1 mt-14">
      <div className="p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Video Upload
        </h1>
        <form onSubmit={handleUpload} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-1"
            >
              Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter a title for your video..."
              className="block w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="video"
              className="inline-block w-full text-center px-6 py-3 text-white bg-black rounded-lg cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 font-medium"
            >
              Select Video
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              id="video"
              className="hidden"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Description:
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Add a description for your video..."
              className="block w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {uploadProgress > 0 && (
            <div>
              <progress
                value={uploadProgress}
                max="100"
                className="w-full h-2 rounded-lg bg-blue-500"
              ></progress>
              <span className="text-sm text-gray-600">{uploadProgress}%</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r bg-black  text-white font-semibold rounded-lg shadow-md hover:bg-gradient-to-r"
          >
            Upload Video
          </button>
        </form>

        {thumbnail && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-700">Thumbnail:</h3>

            <Image
              src={`https://your-video-platform.onrender.com/${thumbnail}`}
              alt="Thumbnail"
              width={300}
              height={240}
              className="mt-3 object-cover rounded-lg border"
            />
          </div>
        )}
      </div>

      {videoUrl && (
        <div className=" ml-8">
          <video
            controls
            className="mt-3 w-48 h-48 object-cover rounded-lg"
            src={videoUrl}
          />
        </div>
      )}
    </div>
  );
};

export default VideoUploadComponent;
