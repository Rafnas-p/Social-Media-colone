import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
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
