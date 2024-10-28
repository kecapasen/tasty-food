"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Layout, { Pages } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Role } from "@repo/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, patch } from "@/util/http-request";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { GetUserDTO } from "@repo/dto";
import { useRouter } from "next/navigation";
import Spinner from "@/components/spinner";

const employeeFormSchema = z.object({
  userId: z.number({ invalid_type_error: "userID harus berupa angka." }),
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

const EditEmployee = ({ params }: { params: { slug: string } }) => {
  const [files, setFiles] = useState<Blob[]>([]);
  const linkRef = useRef<string | null>(null);
  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    setFiles([acceptedFiles[0]!]);
    linkRef.current = URL.createObjectURL(acceptedFiles[0]!);
  }, []);
  const { toast } = useToast();
  const { push } = useRouter();
  const { data, isPending, isSuccess } = useQuery<{
    data: GetUserDTO;
  }>({
    queryKey: ["employee"],
    queryFn: async () => {
      return await get(`/user/${parseInt(params.slug)}`);
    },
  });
  const form = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
  });
  const { getRootProps, open } = useDropzone({
    maxFiles: 1,
    noClick: true,
    onDrop,
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof employeeFormSchema>) => {
      const formData = new FormData();
      files.length > 0 && formData.append("file", files[0]!);
      formData.append("fullname", values.fullname);
      formData.append("role", values.role);
      formData.append("password", values.password);
      return await patch(`/user/${params.slug}`, formData);
    },
    onMutate: () => {
      toast({
        title: "Mohon tunggu...",
        description: "Mohon tunggu, proses sedang berlangsung.",
      });
    },
    onSuccess: (data: { statusCode: number; message: string }) => {
      toast({
        title: "Sukses!",
        description: data.message,
      });
      push("/admin/karyawan");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
        action: (
          <ToastAction
            altText="Coba lagi"
            onClick={() => mutation.mutate(form.getValues())}
          >
            Coba lagi
          </ToastAction>
        ),
      });
    },
  });
  const onSubmit = (values: z.infer<typeof employeeFormSchema>) => {
    mutation.mutate(values);
  };
  useEffect(() => {
    if (isSuccess && !!data.data) {
      form.setValue("userId", data.data.userId);
      form.setValue("fullname", data.data.fullname);
      form.setValue("role", data.data.role);
      form.setValue("password", data.data.password);
    }
  }, [isSuccess]);
  return (
    <Layout
      active={Pages.EMPLOYEE}
      breadcrumb={[
        { title: "Karyawan", href: "/admin/karyawan" },
        { title: "Edit karyawan" },
      ]}
    >
      {isPending && <Spinner />}
      {isSuccess && !!data.data && (
        <>
          <div className="grid grid-cols-4 gap-4 justify-between md:justify-start">
            <div className="col-span-1 flex flex-col gap-2">
              <Card
                className="w-full flex justify-center h-48 aspect-square group border-input border-dashed relative bg-muted overflow-hidden"
                {...getRootProps()}
              >
                {linkRef.current || data.data.avatar ? (
                  <Image
                    src={linkRef.current || data.data.avatar!}
                    alt="Dekorasi"
                    fill
                    className="object-cover"
                    priority
                    quality={100}
                  />
                ) : (
                  <p className="text-xl font-bold self-center">
                    {data.data.fullname
                      .split(" ")
                      .map((data: string) => data[0]?.toUpperCase())
                      .join("")}
                  </p>
                )}
              </Card>
              <Button variant="outline" size="sm" onClick={open}>
                Unggah gambar
              </Button>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                id="employeeForm"
                className="col-span-3 grid grid-cols-2 gap-4"
                spellCheck="false"
              >
                <FormField
                  control={form.control}
                  name="fullname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama lengkap</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Contoh: Frz..."
                          value={field.value || ""}
                          onChange={(event) => {
                            field.onChange(event.target.value || "");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan nama lengkap karyawan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UserID</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          value={field.value || ""}
                          onChange={(event) => {
                            field.onChange(parseInt(event.target.value) || "");
                          }}
                          disabled
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan userID karyawan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Contoh: admin#1234"
                          value={field.value || ""}
                          onChange={(event) => {
                            field.onChange(event.target.value || "");
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Masukkan password karyawan.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih role karyawan..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(Role).map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Pilih role yang sesuai untuk karyawan ini.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <Separator />
          <Button
            size="lg"
            type="submit"
            disabled={mutation.isPending}
            form="employeeForm"
          >
            Simpan
          </Button>
        </>
      )}
    </Layout>
  );
};

export default EditEmployee;
