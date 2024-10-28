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
import Link from "next/link";
import { Button } from "./ui/button";
import BreadcrumbListItem, { BreadcrumbType } from "./breadcrumb-list";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/util/http-request";
import { GetUserDTO } from "@repo/dto";
import Spinner from "./spinner";

export enum Pages {
  DASHBOARD = "Dashboard",
  MENU = "Menu",
  NEWS = "Berita",
  GALLERY = "Galeri",
  EMPLOYEE = "Karyawan",
  CONTACT = "Kontak",
  HISTORY = "Riwayat",
  REPORT = "Laporan",
  ORDER = "Order",
  CART = "Cart",
}

const Layout = ({
  children,
  active,
  breadcrumb,
}: {
  children: ReactNode;
  active: Pages;
  breadcrumb: BreadcrumbType[];
}) => {
  const { data, isPending, isSuccess } = useQuery<{
    data: GetUserDTO;
  }>({
    queryKey: ["getme"],
    queryFn: async () => {
      return await get("/auth/getme");
    },
  });
  return (
    <div className="min-h-dvh flex font-normal text-stone-800 font-poppins">
      {isPending && <Spinner />}
      {isSuccess && !!data.data && (
        <>
          <div className="w-64 lg:flex flex-col gap-2 p-4 border-r relative hidden">
            <p className="text-xl font-bold text-center pb-2">
              Tasty <span className="text-amber-500 underline">Food.</span>
            </p>
            <Separator />
            {data.data.role === "ADMIN" ? (
              <>
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.DASHBOARD ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/dashboard" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <House className="h-5 w-5" />
                      <p>Dashboard</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.MENU ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/menu" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <Soup className="h-5 w-5" />
                      <p>Menu</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.NEWS ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/berita" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <Paperclip className="h-5 w-5" />
                      <p>Berita</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.GALLERY ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/galeri" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <BookImage className="h-5 w-5" />
                      <p>Galeri</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.EMPLOYEE ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/karyawan" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <UsersRound className="h-5 w-5" />
                      <p>Karyawan</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.CONTACT ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/kontak" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <Mail className="h-5 w-5" />
                      <p>Kontak</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.HISTORY ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/riwayat" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <FileText className="h-5 w-5" />
                      <p>Riwayat</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.REPORT ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/admin/laporan" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <ChartLine className="h-5 w-5" />
                      <p>Laporan</p>
                    </div>
                  </Link>
                </Button>
                <Separator />
                <div className="absolute left-0 bottom-0 p-4">
                  <Settings className="h-5 w-5" />
                </div>
              </>
            ) : data.data.role === "CHEF" ? (
              <>
                <Button
                  asChild
                  variant="link"
                  className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.ORDER ? "bg-muted px-4" : "bg-white"}`}
                >
                  <Link href="/chef/order" className="text-sm">
                    <div className="font-semibold flex gap-2">
                      <FileText className="h-5 w-5" />
                      <p>Order</p>
                    </div>
                  </Link>
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
                    <Link href="/waiter/menu" className="text-sm">
                      <div className="font-semibold flex gap-2">
                        <Soup className="h-5 w-5" />
                        <p>Menu</p>
                      </div>
                    </Link>
                  </Button>
                  <Separator />
                  <Button
                    asChild
                    variant="link"
                    className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.CART ? "bg-muted px-4" : "bg-white"}`}
                  >
                    <Link href="/waiter/cart" className="text-sm">
                      <div className="font-semibold flex gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        <p>Keranjang</p>
                      </div>
                    </Link>
                  </Button>
                  <Separator />
                  <Button
                    asChild
                    variant="link"
                    className={`h-auto p-2 hover:px-4 transition-all duration-200 ease-in-out rounded hover:bg-muted justify-start hover:no-underline ${active === Pages.HISTORY ? "bg-muted px-4" : "bg-white"}`}
                  >
                    <Link href="/waiter/riwayat" className="text-sm">
                      <div className="font-semibold flex gap-2">
                        <FileText className="h-5 w-5" />
                        <p>Riwayat</p>
                      </div>
                    </Link>
                  </Button>
                  <Separator />
                </>
              )
            )}
          </div>
          <div className="w-full flex flex-col gap-4 p-4 max-h-dvh overflow-auto">
            <div className="flex justify-between items-center h-[28px] w-full">
              <p className="text-xl font-bold">{`Hai ${data.data.fullname}!`}</p>
              <Avatar>
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
