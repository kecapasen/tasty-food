"use client";
import { instance } from "@/lib";
import { AxiosRequestConfig } from "axios";

export const get = async (path: string, config?: AxiosRequestConfig) => {
  try {
    const response = await instance.get(path, {
      ...config,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const post = async (
  path: string,
  data: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await instance.post(path, data, { ...config });
    return response.data;
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const patch = async (
  path: string,
  data: any,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await instance.patch(path, data, { ...config });
    return response.data;
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
export const del = async (path: string, config?: AxiosRequestConfig) => {
  try {
    const response = await instance.delete(path, {
      ...config,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
