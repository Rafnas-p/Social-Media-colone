// import axios from 'axios';

// // Define the base URL and API key
// const BASE_URL = 'https://youtube138.p.rapidapi.com';
// const API_KEY = '236f58957fmsh287def0b95c1bd3p1e738ajsn7e45f4d8565f';

// // Define the options for the axios request
// const options = {
//   method: 'GET',
//   params: {
//     hl: 'en',
//     gl: 'US'
//   },
//   headers: {
//     'x-rapidapi-key': API_KEY,
//     'x-rapidapi-host': 'youtube138.p.rapidapi.com'
//   }
// };

// // Define the structure of the data you expect from the API
// interface ApiResponse {
//   contents: Array<any>; // Adjust this according to the actual structure of the response contents
// }

// // Define the function with types
// export const fetchDataFromApi = async (url: string): Promise<ApiResponse['contents']> => {
//   try {
//     const { data } = await axios.get(`${BASE_URL}/${url}`, options);
    
//     return data.contents; // Ensure this matches the structure you expect
//   } catch (error) {
//     console.error('Error fetching data from API:', error);
//     throw error; // Rethrow the error for further handling if needed
//   }
// };
import axios from 'axios';

// Define the base URL and API key
const BASE_URL = 'https://youtube-v31.p.rapidapi.com';
const API_KEY = '984ad391e4mshf52e1e818d46d60p19e9d0jsn4d367debcd40';

// Define the options for the axios request
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'youtube-v31.p.rapidapi.com'
  }
};

// Define the structure of the data you expect from the API
interface ApiResponse {
  items: Array<any>; // Use 'items' or the correct field based on API response structure
}

// Define the function with types
export const fetchDataFromApi = async (path: string, params?: Record<string, string | number>): Promise<ApiResponse['items']> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${path}`, {
      ...options,
      params: {
        hl: 'en',
        gl: 'US',
        ...params, // Spread custom parameters if provided
      }
    });
    console.log('Fetched data:', data);

    // Verify and return the structure based on the API response
    if (data.items) {
      return data.items; // Ensure 'items' matches the actual response key
    } else {
      console.warn('Unexpected response structure:', data);
      return []; // Return an empty array if 'items' is not found
    }
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error; // Rethrow for further handling if needed
  }
};

// Example usage
(async () => {
  try {
    const results = await fetchDataFromApi('search', {
      relatedToVideoId: '7ghhRHRP6t4',
      part: 'id,snippet',
      type: 'video',
      maxResults: 50
    });
    console.log('Results:', results);
  } catch (error) {
    console.error('Error:', error);
  }
})();
