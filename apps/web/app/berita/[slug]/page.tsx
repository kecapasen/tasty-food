"use client";

import Spinner from "@/components/spinner";
import { get } from "@/util/http-request";
import { GetNewsDTO } from "@repo/dto";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useState, useEffect, Usable, use } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Editable, RenderElementProps, RenderLeafProps } from "slate-react";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SlateNews, {
  BlockQuoteElement,
  BulletedListElement,
  DefaultElement,
  HeadingElement,
  Leaf,
  ListElement,
  OrderedListElement,
  SubHeadingElement,
} from "@/components/slate";

const DetailNews = ({ params }: { params: Usable<{ slug: string }> }) => {
  const { slug } = use(params);
  const { data, isPending, isSuccess } = useQuery<{
    data: GetNewsDTO;
  }>({
    queryKey: ["news"],
    queryFn: async () => {
      return await get(`/news/${parseInt(slug)}`);
    },
  });
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading-one":
        return <HeadingElement {...props} />;
      case "heading-two":
        return <SubHeadingElement {...props} />;
      case "bulleted-list":
        return <BulletedListElement {...props} />;
      case "numbered-list":
        return <OrderedListElement {...props} />;
      case "list-item":
        return <ListElement {...props} />;
      case "blockquote":
        return <BlockQuoteElement {...props} />;
      case "paragraph":
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);
  return (
    <>
      {isPending && (
        <div className="h-dvh flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {isSuccess && !!data?.data && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-16 p-16">
            <div className="flex flex-col gap-2">
              <p className="text-4xl font-bold">{data.data.title}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 relative">
                  <Avatar>
                    <AvatarImage
                      src={data.data.user.avatar || undefined}
                      alt="Dekorator"
                    />
                    <AvatarFallback className="font-semibold">
                      {data.data.user.fullname
                        .split(" ")
                        .map((data: string) => data[0]?.toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{data.data.user.fullname}</p>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <p className="text-sm">
                  {format(new Date(data.data.createdAt), "PPPppp", {
                    locale: id,
                  })}
                </p>
              </div>
            </div>
            <Card className="w-full flex justify-center h-[32rem] items-center aspect-video group relative shadow-inner overflow-hidden">
              <Image
                src={data.data.headerImage}
                alt="Dekorasi"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </Card>
            <SlateNews content={data.data.article}>
              <Editable
                readOnly
                className="text-base antialiased text-primary"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </SlateNews>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default DetailNews;
