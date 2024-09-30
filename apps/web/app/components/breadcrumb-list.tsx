import React, { useEffect, useState } from "react";
import {
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import BreadcrumbItemList from "./breadcrumb-item";
export type BreadcrumbType = {
  title: string;
  href?: string;
};
const BreadcrumbListItem = ({
  breadcrumb,
}: {
  breadcrumb: BreadcrumbType[];
}) => {
  const [breadcrumbList, setBreadcrumbList] = useState<BreadcrumbType[]>([]);
  useEffect(() => {
    setBreadcrumbList(breadcrumb.slice(0, -1));
  }, [breadcrumb]);
  return (
    <BreadcrumbList className="text-stone-800">
      {breadcrumbList.map((item: BreadcrumbType, index: number) => (
        <BreadcrumbItemList key={index} item={item} />
      ))}
      <BreadcrumbItem>
        <BreadcrumbPage className="font-semibold">
          {breadcrumb[breadcrumb.length - 1]?.title}
        </BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  );
};

export default BreadcrumbListItem;
