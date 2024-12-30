"use client";
import React, { ReactNode } from "react";
import {
  House,
  FileText,
  BookImage,
  Soup,
  Paperclip,
  Settings,
  UsersRound,
  ChartLine,
  ShoppingCart,
  Mail,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "./ui/button";
import BreadcrumbListItem, { BreadcrumbType } from "./breadcrumb-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get } from "@/util/http-request";
import { GetUserDTO } from "@repo/dto";
import Spinner from "./spinner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/auth/logout";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ToastAction } from "./ui/toast";

export enum Pages {
  DASHBOARD = "Dashboard",
  MENU = "Menu",
  NEWS = "Berita",
  GALLERY = "Galeri",
  EMPLOYEE = "Karyawan",
  CONTACT = "Kontak",
  HISTORY = "Riwayat",
  ORDER = "Order",
  CART = "Cart",
}

const Layout = ({
  children,
  active,
  breadcrumb,
}: {
  children: ReactNode;
  active?: Pages;
  breadcrumb: BreadcrumbType[];
}) => {
  const { toast } = useToast();
  const { push } = useRouter();
  const { data, isPending, isSuccess } = useQuery<{
    data: GetUserDTO;
  }>({
    queryKey: ["getme"],
    queryFn: async () => {
      return await get("/auth/getme");
    },
  });
  const mutation = useMutation({
    mutationFn: async () => {
      return await logout();
    },
    onMutate: () => {
      toast({
        title: "Mohon tunggu...",
        description: "Mohon tunggu, proses sedang berlangsung.",
      });
    },
    onSuccess: () => {
      toast({
        title: "Sukses!",
        description: "Mengalihkan...",
      });
      push("/auth/signin");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
        action: (
          <ToastAction altText="Coba lagi" onClick={() => mutation.mutate()}>
            Coba lagi
          </ToastAction>
        ),
      });
    },
  });
  return (
    <div className="min-h-dvh flex font-normal text-stone-800 font-poppins">
      {isPending && <Spinner />}
      {isSuccess && !!data.data && (
        <>
          <div className="w-64 lg:flex flex-col gap-2 p-4 border-r relative hidden">
            <p className="text-xl font-bold text-center pb-2">
              Tasty <span className="text-accent underline">Food.</span>
            </p>
            <Separator />
            {data.data.role === "ADMIN" ? (
              <>
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.DASHBOARD ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/admin/dashboard" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <House className="h-4 w-4" />
                      <p>Dashboard</p>
                    </div>
                  </a>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.MENU ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/admin/menu" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <Soup className="h-4 w-4" />
                      <p>Menu</p>
                    </div>
                  </a>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.NEWS ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/admin/berita" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      <p>Berita</p>
                    </div>
                  </a>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.GALLERY ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/admin/galeri" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <BookImage className="h-4 w-4" />
                      <p>Galeri</p>
                    </div>
                  </a>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.EMPLOYEE ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/admin/karyawan" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <UsersRound className="h-4 w-4" />
                      <p>Karyawan</p>
                    </div>
                  </a>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.CONTACT ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/admin/kontak" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <p>Kontak</p>
                    </div>
                  </a>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.HISTORY ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/admin/riwayat" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <p>Riwayat</p>
                    </div>
                  </a>
                </Button>
                <Separator />
                <div className="absolute left-0 bottom-0 p-4">
                  <Settings className="h-4 w-4" />
                </div>
              </>
            ) : data.data.role === "CHEF" ? (
              <>
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.ORDER ? "bg-muted px-4" : "bg-white"}`}
                >
                  <a href="/chef/order" className="text-sm">
                    <div className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <p>Order</p>
                    </div>
                  </a>
                </Button>
                <Separator />
              </>
            ) : (
              data.data.role === "WAITER" && (
                <>
                  <Button
                    asChild
                    variant="link"
                    className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.MENU ? "bg-muted px-4" : "bg-white"}`}
                  >
                    <a href="/waiter/menu" className="text-sm">
                      <div className="font-semibold flex items-center gap-2">
                        <Soup className="h-4 w-4" />
                        <p>Menu</p>
                      </div>
                    </a>
                  </Button>
                  <Separator />
                  <Button
                    asChild
                    variant="link"
                    className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.CART ? "bg-muted px-4" : "bg-white"}`}
                  >
                    <a href="/waiter/cart" className="text-sm">
                      <div className="font-semibold flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        <p>Keranjang</p>
                      </div>
                    </a>
                  </Button>
                  <Separator />
                  <Button
                    asChild
                    variant="link"
                    className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.HISTORY ? "bg-muted px-4" : "bg-white"}`}
                  >
                    <a href="/waiter/riwayat" className="text-sm">
                      <div className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <p>Riwayat</p>
                      </div>
                    </a>
                  </Button>
                  <Separator />
                </>
              )
            )}
          </div>
          <div className="w-full flex flex-col gap-4 p-4 max-h-dvh overflow-auto">
            <div className="flex justify-between items-center h-[28px] w-full">
              <p className="text-xl font-bold">{`Hai ${data.data.fullname}!`}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={data.data.avatar || undefined}
                      alt="Dekorator"
                    />
                    <AvatarFallback className="font-semibold">
                      {data.data.fullname
                        .split(" ")
                        .map((data: string) => data[0]?.toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <DropdownMenuLabel>Akun saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Lihat profil</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
                    disabled={mutation.isPending}
                    onClick={() => {
                      mutation.mutate();
                    }}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Separator />
            <Breadcrumb className="text-stone-800">
              <BreadcrumbListItem breadcrumb={breadcrumb} />
            </Breadcrumb>
            <Separator />
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default Layout;
