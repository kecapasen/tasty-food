import React from "react";
import Image from "next/image";
import { toIDR } from "@/util";
import { Separator } from "@/components/ui/separator";
import { GetMenuDTO } from "@repo/dto";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CardMenu = ({ menu }: { menu: GetMenuDTO }) => {
  return (
    <Card>
      <CardContent className="flex flex-col p-0">
        <div className="w-full h-48 aspect-square relative group">
          <Image
            src={menu.image}
            alt="Dekorasi"
            fill={true}
            className="object-contain"
            priority
            quality={100}
          />
          <Badge className="absolute top-4 left-4 z-10 bg-rose-500 hover:bg-rose-600">
            Best Seller🔥
          </Badge>
        </div>
        <div className="px-4">
          <Separator />
        </div>
        <div className="p-4 flex flex-col gap-4">
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
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardMenu;
