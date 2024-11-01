// utils/youtubeApi.ts
import axios, { AxiosRequestConfig } from 'axios';

// Base URL for the YouTube API
const BASE_URL = 'https://youtube-v31.p.rapidapi.com/search';

interface ApiResponse {
  items?: Array<any>; // Adjusted for YouTube API response structure
}

const options: AxiosRequestConfig = {
  params: {
    // Define the parameters for the API request
    relatedToVideoId: '7ghhRHRP6t4', // Example video ID, can be replaced with a dynamic value
    part: 'id,snippet',
    type: 'video',
    maxResults: '50'
  },
  headers: {
    'X-RapidAPI-Key': process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || '236f58957fmsh287def0b95c1bd3p1e738ajsn7e45f4d8565f', // Use your environment variable
    'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com',
  },
};

export const fetchDataFromApi = async (): Promise<ApiResponse | null> => {
  try {
    const { data } = await axios.get<ApiResponse>(BASE_URL, options);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};
