import axios from "axios";

// const API_URL = process.env.API_SIGNALR;
const API_URL = "https://localhost:7218/";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
