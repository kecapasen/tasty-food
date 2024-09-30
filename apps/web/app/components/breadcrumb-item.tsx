import React from "react";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { BreadcrumbType } from "./breadcrumb-list";

const BreadcrumbItemList = ({ item }: { item: BreadcrumbType }) => (
  <>
    <BreadcrumbItem>
      <BreadcrumbLink href={item.href} className="hover:underline">
        {item.title}
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
  </>
);

export default BreadcrumbItemList;
