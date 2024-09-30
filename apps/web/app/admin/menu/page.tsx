"use client";
import React from "react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GetMenuDTO } from "@repo/dto";
import {
  useQueryClient,
  useQuery,
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";
import { get } from "@/util/http-request";
import SkeletonMenu from "@/components/menu/skeleton/skeleton-menu";
import CardMenu from "@/components/menu/card-menu";
import Link from "next/link";

const Menu = () => {
  const queryClient = useQueryClient();
  const { data, error, isError, isPending, isSuccess } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      return await get("/menu");
    },
  });
  return (
    <Layout breadcrumb={[{ title: "Menu" }]}>
      <div className="flex gap-4 justify-between md:justify-start items-center">
        <Button
          asChild
          className="bg-emerald-500 hover:bg-emerald-600"
          size="sm"
        >
          <Link href={"/admin/menu/tambah"} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah menu
          </Link>
        </Button>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {isPending &&
          Array.from({ length: 8 }).map((_, index: number) => {
            return <SkeletonMenu key={index} />;
          })}
        {isSuccess &&
          !!data &&
          data.data.map((menu: GetMenuDTO, index: number) => {
            return <CardMenu key={index} menu={menu} />;
          })}
      </div>
    </Layout>
  );
};

const queryClient = new QueryClient();
const QueryProvider = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Menu />
    </QueryClientProvider>
  );
};

export default QueryProvider;
