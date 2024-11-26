"use client"
import React, { useState } from 'react';
import axios from 'axios';

const VideoUploadComponent = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [description, setDescription] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e) => {
        setVideoFile(e.target.files[0]);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!videoFile) {
            alert('Please select a video file.');
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('description', description);

        try {
            const response = await axios.post('http://localhost:5000/videos/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });

            alert('Video uploaded successfully!');
            setThumbnail(response.data.thumbnailPath);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload video.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4 text-center">Video Upload</h1>
                <form onSubmit={handleUpload} className="space-y-4">
                   
                    <div>
                        <label htmlFor="video" className="block text-gray-700 font-medium mb-1">Select Video:</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleFileChange}
                            id="video"
                            className="block w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-medium mb-1">Description:</label>
                        <textarea
                            id="description"
                            rows="4"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Add a description for your video..."
                            className="block w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    
                    {uploadProgress > 0 && (
                        <div>
                            <progress value={uploadProgress} max="100" className="w-full h-2 rounded-lg bg-blue-500"></progress>
                            <span className="text-sm text-gray-600">{uploadProgress}%</span>
                        </div>
                    )}

                    
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Upload Video
                    </button>
                </form>

              
                {thumbnail && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-700">Thumbnail:</h3>
                        <img
                            src={`http://localhost:5000/${thumbnail}`}
                            alt="Thumbnail"
                            className="mt-2 w-80 h-60 rounded-lg border"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoUploadComponent;
