"use client";
import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ToastAction } from "@/components/ui/toast";
import { get, post } from "@/util";
import { GetSiteDTO } from "@repo/dto";
import Spinner from "@/components/spinner";

const contactFormSchema = z.object({
  subject: z
    .string()
    .min(1, { message: "Subject harus diisi dan minimal 1 karakter." })
    .max(100, { message: "Panjang maksimal subject adalah 100 karakter." }),
  name: z
    .string()
    .min(1, { message: "Nama harus diisi dan minimal 1 karakter." })
    .max(100, { message: "Panjang maksimal nama adalah 100 karakter." }),
  email: z
    .string()
    .min(1, { message: "Email harus diisi dan minimal 1 karakter." })
    .max(100, { message: "Panjang maksimal email adalah 100 karakter." }),
  message: z
    .string()
    .min(1, { message: "Message harus diisi dan minimal 1 karakter." }),
});

const Kontak = () => {
  const { toast } = useToast();
  const site = useQuery<{
    data: GetSiteDTO;
  }>({
    queryKey: ["site"],
    queryFn: async () => {
      return await get("/site");
    },
  });
  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      subject: "",
      name: "",
      email: "",
      message: "",
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof contactFormSchema>) => {
      return await post("/contact", values);
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
      form.reset();
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
  const onSubmit = (values: z.infer<typeof contactFormSchema>) =>
    mutation.mutate(values);
  return (
    <>
      {site.isPending && (
        <div className="h-dvh flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {site.data && (
        <div className="min-h-dvh overflow-x-hidden">
          <Navbar title="KONTAK KAMI" />
          <div className="p-16 flex flex-col justify-center gap-16">
            <p className="text-3xl font-bold text-start">KONTAK KAMI</p>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-2"
                id="menuForm"
                spellCheck="false"
              >
                <div className="grid grid-cols-2 gap-2 text-sm w-full">
                  <div className="flex flex-col gap-2">
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="py-8 px-4"
                              placeholder="Subject"
                              value={field.value || ""}
                              onChange={(event) => {
                                field.onChange(event.target.value || "");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              className="py-8 px-4"
                              placeholder="Nama"
                              value={field.value || ""}
                              onChange={(event) => {
                                field.onChange(event.target.value || "");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="py-8 px-4"
                              placeholder="Email"
                              value={field.value || ""}
                              onChange={(event) => {
                                field.onChange(event.target.value || "");
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={12}
                            placeholder="Message"
                            className="resize-none"
                            value={field.value || ""}
                            onChange={(event) => {
                              field.onChange(event.target.value || "");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-sm bg-stone-950 p-8"
                  disabled={mutation.isPending}
                >
                  KIRIM
                </Button>
              </form>
            </Form>
          </div>
          <div className="p-16 flex justify-evenly items-center">
            <div className="flex flex-col gap-2 items-center">
              <Image
                src={"/Group 66@2x.png"}
                alt="Dekorasi"
                height={48}
                width={48}
                priority
                quality={100}
              />
              <p className="text-lg font-bold">Email</p>
              <p className="text-sm">{site.data.data.email}</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Image
                src={"/Group 67@2x.png"}
                alt="Dekorasi"
                height={48}
                width={48}
                priority
                quality={100}
              />
              <p className="text-lg font-bold">Phone</p>
              <p className="text-sm">{`+62 ${site.data.data.contact}`}</p>
            </div>
            <div className="flex flex-col gap-2 items-center">
              <Image
                src={"/Group 68@2x.png"}
                alt="Dekorasi"
                height={48}
                width={48}
                priority
                quality={100}
              />
              <p className="text-lg font-bold">Lokasi</p>
              <p className="text-sm">{site.data.data.location}</p>
            </div>
          </div>
          <div className="p-16">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2097.68975289662!2d107.30044364289157!3d-7.019756718228912!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68f791f68958bf%3A0x2e49f652a8e01da3!2sTasty%20Food!5e0!3m2!1sid!2sid!4v1719037251462!5m2!1sid!2sid"
              className="border-0 h-[512px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default Kontak;
