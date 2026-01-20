import axios from "axios";

const API = axios.create({
  baseURL: "http://ec2-65-0-180-138.ap-south-1.compute.amazonaws.com:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
