import axios from 'axios';


const baseURL = 'http://localhost:4000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;