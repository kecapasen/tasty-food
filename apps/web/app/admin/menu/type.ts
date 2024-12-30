import { Category } from "@repo/db";
import { z } from "zod";

export const menuFormSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Nama menu harus diisi dan minimal 1 karakter." }),
  description: z.string().optional(),
  price: z
    .number({ invalid_type_error: "Harga harus berupa angka." })
    .min(1000, { message: "Harga minimal adalah Rp 1.000." }),
  category: z.nativeEnum(Category, {
    errorMap: () => ({ message: "Kategori harus dipilih." }),
  }),
});
