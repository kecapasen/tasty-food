import axios from "axios";
export const instance = axios.create({
  baseURL: "http://152.42.252.147:2000/v1",
  withCredentials: true,
});
