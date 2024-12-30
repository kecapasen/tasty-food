import { z } from "zod";

export const newsFormSchema = z.object({
  title: z.string().min(1, { message: "Judul harus diisi." }),
});
