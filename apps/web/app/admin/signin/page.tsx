"use client";
import React from "react";
import Link from "next/link";
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
import { Checkbox } from "@/components/ui/checkbox";
const formSchema = z.object({
  username: z.string().min(1, { message: "Username tidak boleh kosong." }),
  password: z.string().min(1, { message: "Password tidak boleh kosong." }),
  rememberMe: z.boolean().default(true).optional(),
});
const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: true,
    },
  });
  const { control, handleSubmit } = form;
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };
  return (
    <div className="min-h-dvh flex justify-center items-center font-bold text-stone-800 bg-slate-100">
      <div className="grid grid-cols-2">
        <Card className="w-96 rounded-tr-none rounded-br-none border-r-0 h-full">
          <FormProvider {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col justify-between h-full"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-center font-bold">
                  Welcome Back!
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <FormField
                  control={control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="rizkyfrz"
                          {...field}
                          className="font-normal"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div className="flex justify-between">
                          <p>Password</p>
                          <Button variant="link" className="text-xs p-0 h-auto">
                            <Link href="/forgot" className="text-sky-500">
                              Forgot Password?
                            </Link>
                          </Button>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="font-normal"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="cursor-pointer">
                          Remember Me?
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="h-full">
                <Button type="submit" className="w-full">
                  Sign in
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
              Tasty <span className="text-amber-500 underline">Food.</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
