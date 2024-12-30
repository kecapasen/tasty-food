import { Role } from "@repo/db";
import { z } from "zod";

export const employeeFormSchema = z.object({
  userId: z
    .string()
    .min(8, { message: "UserID harus diisi dan minimal 8 angka." }),
  fullname: z
    .string()
    .min(3, { message: "Nama harus diisi dan minimal 3 karakter." }),
  password: z
    .string()
    .min(6, { message: "Nama harus diisi dan minimal 6 karakter." }),
  role: z.nativeEnum(Role, {
    errorMap: () => ({ message: "Role harus dipilih." }),
  }),
});
