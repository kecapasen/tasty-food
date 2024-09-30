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
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";
import BreadcrumbListItem, { BreadcrumbType } from "./breadcrumb-list";

const Layout = ({
  children,
  breadcrumb,
}: {
  children: ReactNode;
  breadcrumb: BreadcrumbType[];
}) => {
  return (
    <div className="min-h-dvh flex font-normal text-stone-800 font-poppins">
      <div className="w-64 lg:flex flex-col gap-4 p-4 border-r relative hidden">
        <p className="text-xl font-bold text-center">
          Tasty <span className="text-amber-500 underline">Food.</span>
        </p>
        <Separator />
        <div className="font-semibold flex gap-2 px-4">
          <div className="relative">
            <House className="h-5 w-5" fill="#f59e0b" />
            <House className="h-5 w-5 absolute top-0 z-50" />
          </div>
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/admin/dashboard" className="text-sm">
              Dashboard
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="font-semibold flex gap-2 px-4">
          <Soup className="h-5 w-5" />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/admin/menu" className="text-sm">
              Menu
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="font-semibold flex gap-2 px-4">
          <Paperclip className="h-5 w-5" />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/admin/news" className="text-sm">
              Berita
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="font-semibold flex gap-2 px-4">
          <BookImage className="h-5 w-5" />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/admin/gallery" className="text-sm">
              Galeri
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="font-semibold flex gap-2 px-4">
          <UsersRound className="h-5 w-5" />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/admin/karyawan" className="text-sm">
              Karyawan
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="font-semibold flex gap-2 px-4">
          <FileText className="h-5 w-5" />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/admin/riwayat" className="text-sm">
              Riwayat
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="font-semibold flex gap-2 px-4">
          <ChartLine className="h-5 w-5" />
          <Button asChild variant="link" className="p-0 h-auto">
            <Link href="/admin/laporan" className="text-sm">
              Laporan
            </Link>
          </Button>
        </div>
        <Separator />
        <div className="absolute left-0 bottom-0 p-4">
          <Settings className="h-5 w-5" />
        </div>
      </div>
      <div className="w-full flex flex-col gap-4 p-4 max-h-dvh overflow-auto">
        <div className="flex justify-between items-center h-[28px] w-full">
          <p className="text-xl font-bold">Hai rizkyfrz!</p>
          <Avatar>
            <AvatarFallback className="text-stone-800 font-semibold">
              RM
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
    </div>
  );
};

export default Layout;
