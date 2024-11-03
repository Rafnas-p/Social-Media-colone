import axios from 'axios';

// Define the base URL and API key
const BASE_URL = 'https://youtube138.p.rapidapi.com';
const API_KEY = '236f58957fmsh287def0b95c1bd3p1e738ajsn7e45f4d8565f';

// Define the options for the axios request
const options = {
  method: 'GET',
  params: {
    hl: 'en',
    gl: 'US'
  },
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'youtube138.p.rapidapi.com'
  }
};

// Define the structure of the data you expect from the API
interface ApiResponse {
  contents: Array<any>; // Adjust this according to the actual structure of the response contents
}

// Define the function with types
export const fetchDataFromApi = async (url: string): Promise<ApiResponse['contents']> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    return data.contents; // Ensure this matches the structure you expect
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error; // Rethrow the error for further handling if needed
  }
};
