"use client";
import React, { useCallback, useState, useRef } from "react";
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
import { Category } from "@repo/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/util/http-request";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const menuFormSchema = z.object({
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

const AddMenu = () => {
  const [files, setFiles] = useState<Blob[]>([]);
  const linkRef = useRef<string | null>(null);
  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    setFiles([acceptedFiles[0]!]);
    linkRef.current = URL.createObjectURL(acceptedFiles[0]!);
  }, []);
  const { toast } = useToast();
  const { push } = useRouter();
  const form = useForm<z.infer<typeof menuFormSchema>>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: {
      price: undefined,
    },
  });
  const { getRootProps, open } = useDropzone({
    maxFiles: 1,
    noClick: true,
    onDrop,
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof menuFormSchema>) => {
      if (files.length < 1) {
        toast({
          variant: "destructive",
          title: "Tidak ada file",
          description: "Harap pilih file sebelum melanjutkan.",
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", files[0]!);
      formData.append("name", values.name);
      values.description && formData.append("description", values.description);
      formData.append("price", values.price.toString());
      formData.append("category", values.category);
      return await post("/menu", formData);
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
      push("/admin/menu");
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
  const onSubmit = (values: z.infer<typeof menuFormSchema>) => {
    mutation.mutate(values);
  };
  return (
    <Layout
      active={Pages.MENU}
      breadcrumb={[
        { title: "Menu", href: "/admin/menu" },
        { title: "Tambah menu" },
      ]}
    >
      <div className="grid grid-cols-4 gap-4 justify-between md:justify-start">
        <div className="col-span-1 flex flex-col gap-2">
          <Card
            className="w-full flex justify-center items-center h-48 aspect-square group border-input border-dashed relative bg-muted"
            {...getRootProps()}
          >
            {files.length > 0 ? (
              <Image
                src={linkRef.current!}
                alt="Dekorasi"
                fill
                className="object-contain"
                priority
                quality={100}
              />
            ) : (
              <p className="text-xl font-bold">192 x 192</p>
            )}
          </Card>
          <Button variant="outline" size="sm" onClick={open}>
            Unggah gambar
          </Button>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="menuForm"
            className="col-span-3 grid grid-cols-2 gap-4"
            spellCheck="false"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Menu</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Contoh: Nasi Goreng..."
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event.target.value || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan nama menu makanan atau minuman.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga Menu</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(parseInt(event.target.value) || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan harga menu dalam satuan rupiah.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Menu</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Deskripsi singkat tentang menu..."
                      className="resize-none"
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event.target.value || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Tulis deskripsi yang menarik tentang menu ini.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Menu</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori menu..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Category).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih kategori yang sesuai untuk menu ini.
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
        className="ml-auto"
        disabled={mutation.isPending}
        form="menuForm"
      >
        Buat
      </Button>
    </Layout>
  );
};

export default AddMenu;
