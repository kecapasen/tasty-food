import React from "react";
import Image from "next/image";
import { del, toIDR } from "@/util";
import { Separator } from "@/components/ui/separator";
import { GetMenuDTO } from "@repo/dto";
import { Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

const CardMenu = ({ menu }: { menu: GetMenuDTO }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const mutationDel = useMutation({
    mutationFn: async (id: number) => {
      return await del(`/menu/${id}`);
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
      queryClient.invalidateQueries({ queryKey: ["menu"] });
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
    <Card>
      <CardContent className="flex flex-col p-0 h-full group">
        <div className="w-full h-48 aspect-square relative group rounded-t-xl overflow-hidden">
          <Image
            src={menu.image}
            alt="Dekorasi"
            fill={true}
            className="object-contain group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
            priority
            quality={100}
          />
          <div className="absolute flex justify-end -top-full left-0 right-0 group-hover:top-0 transition-all ease-in-out duration-300 bg-gradient-to-b from-primary w-full z-10 p-4">
            <Button
              size="icon"
              className="rounded-full bg-destructive hover:bg-destructive/90"
              onClick={() => mutationDel.mutate(menu.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive-foreground" />
            </Button>
          </div>
          <div className="absolute -bottom-full left-0 right-0 group-hover:bottom-0 transition-all ease-in-out duration-300 bg-gradient-to-t from-primary w-full z-10 p-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={menu.user?.avatar || undefined}
                  alt="Dekorator"
                />
                <AvatarFallback className="font-semibold">
                  {menu
                    .user!.fullname.split(" ")
                    .map((data: string) => data[0]?.toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <p className="text-primary-foreground font-semibold text-sm">
                  {menu.user!.fullname}
                </p>
                <p className="text-muted text-xs">
                  {formatDistanceToNow(new Date(menu.createdAt), {
                    addSuffix: true,
                    includeSeconds: true,
                    locale: id,
                  })}
                </p>
              </div>
            </div>
          </div>
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
          <Button asChild variant="outline" size="sm">
            <a href={`/admin/menu/${menu.id}`}>Edit</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardMenu;
