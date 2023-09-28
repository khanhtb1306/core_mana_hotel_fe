import axios from 'axios';
const BASE_URL = 'https:localhost:0000';

export default axios.create({
    baseURL: BASE_URL
});