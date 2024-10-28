"use client";
import React, { useState } from "react";
import Image from "next/image";
import Layout, { Pages } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { CreateCartDTO, GetMenuDTO } from "@repo/dto";
import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post } from "@/util/http-request";
import Spinner from "@/components/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { toIDR } from "@/util";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Menu = () => {
  const [quantity, setQuantity] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const { data, isPending, isSuccess } = useQuery<{
    data: GetMenuDTO[];
  }>({
    queryKey: ["menu"],
    queryFn: async () => {
      return await get("/menu");
    },
  });
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: async (values: CreateCartDTO) => {
      return await post("/cart", values);
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
      });
    },
  });
  return (
    <Layout active={Pages.MENU} breadcrumb={[{ title: "Menu" }]}>
      {isPending && <Spinner />}
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        {isSuccess &&
          !!data.data &&
          data.data.map((menu: GetMenuDTO, index: number) => {
            const isDialogOpen = openMenuId === menu.id;
            return (
              <Card key={index}>
                <CardContent className="flex flex-col p-0 h-full">
                  <div className="w-full h-48 aspect-square relative group">
                    <Image
                      src={menu.image}
                      alt="Dekorasi"
                      fill={true}
                      className="object-contain"
                      priority
                      quality={100}
                    />
                  </div>
                  <div className="px-4">
                    <Separator />
                  </div>
                  <div className="p-4 flex flex-col justify-between gap-4 flex-grow">
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1 font-semibold">
                        <p className="text-sm">{menu.name}</p>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <p className="text-sm">{toIDR(menu.price)}</p>
                        </div>
                      </div>
                      <div>
                        <Badge>{menu.category}</Badge>
                      </div>
                    </div>
                    <Dialog
                      open={isDialogOpen}
                      onOpenChange={(open) =>
                        setOpenMenuId(open ? menu.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Tambah keranjang
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="font-poppins bg-white">
                        <DialogHeader>
                          <DialogTitle />
                          <div className="flex gap-4">
                            <Card className="w-32 h-32 aspect-square relative group overflow-hidden">
                              <Image
                                src={menu.image}
                                alt="Dekorasi"
                                fill={true}
                                className="object-contain"
                                priority
                                quality={100}
                              />
                            </Card>
                            <div className="flex flex-col justify-between flex-grow">
                              <div className="flex flex-col gap-1 font-semibold">
                                <p className="text-xl">{menu.name}</p>
                                <div className="flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  <p className="text-sm">{toIDR(menu.price)}</p>
                                </div>
                              </div>
                              <Input
                                className="w-full"
                                type="number"
                                placeholder="Kuantitas"
                                value={quantity || ""}
                                onChange={(event) =>
                                  setQuantity(parseInt(event.target.value))
                                }
                              />
                            </div>
                          </div>
                        </DialogHeader>
                        <DialogFooter>
                          <Button
                            className="w-full"
                            type="submit"
                            onClick={() => {
                              mutation.mutate({
                                cartDetail: {
                                  menuId: menu.id,
                                  price: menu.price,
                                  quantity,
                                },
                              });
                              setOpenMenuId(null);
                              setQuantity(1);
                            }}
                          >
                            Tambah
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </Layout>
  );
};

export default Menu;
