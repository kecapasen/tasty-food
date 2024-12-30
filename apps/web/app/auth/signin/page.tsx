"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "@/components/ui/toast";
import { loginFormSchema } from "./type";
import { signin } from "./signin";

const Signin = () => {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      userId: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const { push } = useRouter();

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof loginFormSchema>) => {
      return await signin("/auth/signin", values);
    },
    onMutate: () => {
      toast({
        title: "Mohon tunggu...",
        description: "Mohon tunggu, proses sedang berlangsung.",
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Sukses!",
        description: "Mengalihkan...",
      });
      switch (data.role) {
        case "ADMIN":
          push("/admin/dashboard");
          break;
        case "CHEF":
          push("/chef/order");
          break;
        case "WAITER":
          push("/waiter/menu");
          break;
        default:
          break;
      }
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error!",
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
  const onSubmit = (values: z.infer<typeof loginFormSchema>) => {
    mutation.mutate(values);
  };
  return (
    <div className="min-h-dvh flex justify-center items-center bg-slate-100">
      <div className="grid grid-cols-2">
        <Card className="w-96 rounded-tr-none rounded-br-none border-r-0 h-full">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col justify-between h-full"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-center font-bold">
                  Welcome Back!
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="userId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>userID</FormLabel>
                      <FormControl>
                        <Input placeholder="rizkyfrz" {...field} />
                      </FormControl>
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
                          type="password"
                          {...field}
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="h-full">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Signing in..." : "Sign in"}
                </Button>
              </CardFooter>
            </form>
          </FormProvider>
        </Card>
        <Card className="flex flex-col overflow-hidden h-full rounded-tl-none rounded-bl-none border-l-0">
          <CardContent className="flex flex-col justify-center items-center p-0 h-full aspect-square relative">
            <Image
              src="/sebastian-coman-photography-eBmyH7oO5wY-unsplash.jpg"
              alt="Dekorasi"
              fill={true}
              className="w-auto h-full object-cover brightness-50 scale-x-[-1] select-none"
              priority
              quality={100}
            />
            <p className="text-4xl font-bold text-white absolute">
              Tasty <span className="text-accent underline">Food.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signin;
