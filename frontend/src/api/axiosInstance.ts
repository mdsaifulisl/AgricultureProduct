import axios, { type AxiosInstance } from 'axios';

// কুকি রিড করার হেলপার ফাংশন
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // ১. কুকি থেকে টোকেন নিয়ে Authorization হেডারে সেট করা
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ২. FormData এর জন্য Content-Type হ্যান্ডেল করা
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;