"use server";
import { instance } from "@/lib";
import { AxiosRequestConfig } from "axios";

export const get = async (path: string, options?: AxiosRequestConfig) => {
  try {
    const response = await instance.get(path, {
      ...options,
    });
    return response.data;
  } catch (error: any) {
    console.log(error);
    return error.message;
  }
};
export const post = async (path: string, options?: AxiosRequestConfig) => {
  try {
    const response = await instance.post(path, {
      ...options,
    });
    return response;
  } catch (error: any) {
    return error.message;
  }
};
export const patch = async (path: string, options?: AxiosRequestConfig) => {
  try {
    const response = await instance.patch(path, {
      ...options,
    });
    return response;
  } catch (error: any) {
    return error.message;
  }
};
export const del = async (path: string, options?: AxiosRequestConfig) => {
  try {
    const response = await instance.delete(path, {
      ...options,
    });
    return response;
  } catch (error: any) {
    return error.message;
  }
};
