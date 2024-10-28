import axios from "axios";
export const instance = axios.create({
  baseURL: "http://localhost:2000/v1",
  withCredentials: true,
});
