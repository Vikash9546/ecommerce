import axios from "axios";

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_BASE_URL || "/api";

  // If it's a full URL and missing the /api suffix, add it
  if (url.startsWith("http") && !url.includes("/api")) {
    url = url.endsWith("/") ? `${url}api` : `${url}/api`;
  }

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
