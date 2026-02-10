import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_BASE_URL || "/api";
  return url.endsWith("/") ? url : `${url}/`;
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// 🔐 attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
