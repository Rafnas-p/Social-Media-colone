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


const BASE_URL = process.env.NEXT_PUBLIC_YOUTUBE_API_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': API_KEY,
    'x-rapidapi-host': 'youtube-v31.p.rapidapi.com'
  }
};

interface ApiResponse {
  items: Array<any>; 
}

export const fetchDataFromApi = async (path: string, params?: Record<string, string | number>): Promise<ApiResponse['items']> => {
  try {
    const { data } = await axios.get(`${BASE_URL}/${path}`, {
      ...options,
      params: {
        hl: 'en',
        gl: 'US',
        ...params,
      }
    });
    console.log('Fetched data:', data);
    

    if (data.items) {
      return data.items; 
    } else {
      console.warn('Unexpected response structure:', data);
      return []; 
    }
  } catch (error) {
    console.error('Error fetching data from API:', error);
    throw error;
  }
};

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

export const featchCommentsAPi=async(
  videoId:string,
): Promise<ApiResponse['items']>=>{
try {
  const {data}=await axios.get(`${BASE_URL}/commentThreads`,{
    ...options,
    params:{
      part:'snippet',
      videoId,
      maxResults:100
    }
  })
  console.log('Fetched comments:', data);

  return data.items || [];

} catch (error) {
  console.error('Error fetching comments:', error);
    throw error;
}
}
(async () => {
  try {
    const comments = await featchCommentsAPi('7ghhRHRP6t4');
    console.log('Comments:', comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
})();

//search

export const fetchSearchApi=async():Promise<ApiResponse['items']>=>{
try {

  const {data}=await axios.get(`${BASE_URL}/search`,{
  ...options,
  params: {
    q: 'music',
    part: 'snippet,id',
    regionCode: 'US',
    maxResults: '20',
    order: 'date'
}
});
  console.log('search',data)
  return data.items;
  
} catch (error) {
  console.error('Error fetching search results:', error);
    throw error;

}
  
}
(async () => {
  try {
    const results = await fetchSearchApi();
    console.log('Fetched Search Results:', results);
  } catch (error) {
    console.error('Error while testing fetchSearchApi:', error);
  }
})();
