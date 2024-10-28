import { z } from "zod";

export const loginFormSchema = z.object({
  userId: z.string().min(1, { message: "Username harus diisi." }),
  password: z.string().min(1, { message: "Password harus diisi" }),
});
