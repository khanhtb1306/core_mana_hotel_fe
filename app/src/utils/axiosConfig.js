import axios from "axios";
import { getAuthToken } from "../contexts/auth";

const BASE_URL = "http://localhost:3000/";

export const axiosPublic = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
  withCredentials: true,
});