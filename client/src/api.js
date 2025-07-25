import axios from 'axios';

const productionUrl = 'https://medibook-doctor-appointment-booking.onrender.com';

const API = axios.create({
  baseURL: import.meta.env.PROD ? productionUrl : 'http://localhost:5000',
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export default API;