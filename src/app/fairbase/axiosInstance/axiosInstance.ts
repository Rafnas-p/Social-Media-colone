import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Replace with your backend base URL
});

// Add a request interceptor to include the token and MongoDB _id in every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Retrieve the JWT token from cookies
    const mongoDbId = Cookies.get("mongoDbId"); // Retrieve the MongoDB _id from cookies
   
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add JWT token as Authorization header
    }

    if (mongoDbId) {
      config.headers["X-MongoDb-Id"] = mongoDbId; // Add MongoDB _id as a custom header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
