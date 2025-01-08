import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://your-video-platform.onrender.com",
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); 
    const mongoDbId = Cookies.get("mongoDbId"); 
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; 
    }

    if (mongoDbId) {
      config.headers["X-MongoDb-Id"] = mongoDbId; 
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
