import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const SkeletonMenu = () => {
  return (
    <Card>
      <CardContent className="flex flex-col p-0">
        <div className="w-full h-48 aspect-square relative p-4">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="px-4">
          <Separator />
        </div>
        <div className="p-4 flex flex-col gap-4">
          <div className="flex justify-between ">
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-28" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div>
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-full px-3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default SkeletonMenu;
