"use client";
import Layout from "@/components/layout";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { get, patch } from "@/util";
import { zodResolver } from "@hookform/resolvers/zod";
import { GetSiteDTO } from "@repo/dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const settingFormSchema = z.object({
  aboutUs: z.string().min(1, { message: "Tentang kami wajib diisi." }),
  vision: z.string().min(1, { message: "Visi wajib diisi." }),
  mision: z.string().min(1, { message: "Misi wajib diisi." }),
  email: z.string().min(1, { message: "Email wajib diisi." }),
  contact: z.number().min(10000000000, { message: "Kontak wajib diisi." }),
  location: z.string().min(1, { message: "Lokasi wajib diisi." }),
});

const Setting = () => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof settingFormSchema>>({
    resolver: zodResolver(settingFormSchema),
    defaultValues: {
      aboutUs: "",
      vision: "",
      mision: "",
      email: "",
      contact: 0,
      location: "",
    },
  });
  const { data, isPending, isSuccess } = useQuery<{
    data: GetSiteDTO;
  }>({
    queryKey: ["site"],
    queryFn: async () => {
      return await get("/site");
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof settingFormSchema>) => {
      return await patch("/site", {
        ...values,
        contact: values.contact.toString(),
      });
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
  const onSubmit = (values: z.infer<typeof settingFormSchema>) => {
    mutation.mutate(values);
  };
  useEffect(() => {
    if (isSuccess && !!data.data) {
      form.setValue("aboutUs", data.data.aboutUs);
      form.setValue("vision", data.data.vision);
      form.setValue("mision", data.data.mision);
      form.setValue("email", data.data.email);
      form.setValue("contact", parseInt(data.data.contact));
      form.setValue("location", data.data.location);
    }
  }, [isSuccess]);
  return (
    <Layout breadcrumb={[{ title: "Setting" }]}>
      {isPending && <Spinner />}
      {isSuccess && !!data.data && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="employeeForm"
            className="flex flex-col gap-4"
            spellCheck="false"
          >
            <FormField
              control={form.control}
              name="aboutUs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tentang kami</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event.target.value || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan tentang kami restoran.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visi</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event.target.value || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>Masukkan visi restoran.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Misi</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event.target.value || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>Masukkan misi restoran.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event.target.value || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>Masukkan email restoran.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kontak</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <p className="text-muted-foreground text-sm">+62</p>
                      <Input
                        {...field}
                        placeholder="8***"
                        value={field.value || ""}
                        onChange={(event) => {
                          field.onChange(parseInt(event.target.value) || "");
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>Masukkan kontak restoran.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(event.target.value || "");
                      }}
                    />
                  </FormControl>
                  <FormDescription>Masukkan lokasi restoran.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Button size="lg" type="submit" disabled={mutation.isPending}>
                Simpan
              </Button>
            </div>
          </form>
        </Form>
      )}
    </Layout>
  );
};

export default Setting;
