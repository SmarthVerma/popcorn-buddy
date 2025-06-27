import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_PREFIX,
  timeout: 10_000,
});

instance.interceptors.response.use(
  (response) => {
    console.warn("Response:", response);
    return response.data;
  },
  (error) => Promise.reject(error.response.data)
);

export default instance;
