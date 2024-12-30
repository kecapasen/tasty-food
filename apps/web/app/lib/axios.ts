import axios from "axios";
export const instance = axios.create({
  baseURL: "http://178.128.62.254:2000/v1",
  withCredentials: true,
});
