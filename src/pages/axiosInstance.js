// axiosInstance.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5555', // Replace this with your server's base URL
});

export default instance;
