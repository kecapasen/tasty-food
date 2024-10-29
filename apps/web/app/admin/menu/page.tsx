"use client";
import React from "react";
import Layout, { Pages } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GetMenuDTO } from "@repo/dto";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/util/http-request";
import CardMenu from "@/components/menu/card-menu";
import Spinner from "@/components/spinner";

const Menu = () => {
  const { data, isPending, isSuccess } = useQuery<{
    data: GetMenuDTO[];
  }>({
    queryKey: ["menu"],
    queryFn: async () => {
      return await get("/menu");
    },
  });
  return (
    <Layout active={Pages.MENU} breadcrumb={[{ title: "Menu" }]}>
      <div className="flex gap-4 justify-between md:justify-start items-center">
        <Button asChild size="sm">
          <a href={"/admin/menu/tambah"} className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Tambah menu
          </a>
        </Button>
      </div>
      {isPending && <Spinner />}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {isSuccess &&
          Array.isArray(data.data) &&
          data.data.map((menu: GetMenuDTO, index: number) => {
            return <CardMenu key={index} menu={menu} />;
          })}
      </div>
    </Layout>
  );
};

export default Menu;
