"use server";
import { z } from "zod";
import { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";
import { loginFormSchema } from "./type";
import { instance } from "@/lib";

export const signin = async (
  path: string,
  values: z.infer<typeof loginFormSchema>,
  config?: AxiosRequestConfig
) => {
  try {
    const response = await instance.post(path, values, { ...config });
    const token = response.data.acces_token;
    cookies().set({
      name: "Authentication",
      value: token,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
