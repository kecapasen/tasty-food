"use client";

import Spinner from "@/components/spinner";
import { get } from "@/util/http-request";
import { GetNewsDTO } from "@repo/dto";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useCallback, useMemo, useState, useEffect } from "react";
import { BaseEditor, createEditor } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import Footer from "@/components/footer";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type BlockFormat =
  | "heading-one"
  | "heading-two"
  | "bulleted-list"
  | "numbered-list"
  | "list-item"
  | "blockquote"
  | "paragraph";

type MarkFormat = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type CustomElement = {
  type: BlockFormat;
  children: CustomText[];
};

type CustomText = MarkFormat & {
  text: string;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const BlockQuoteElement = (props: RenderElementProps) => {
  return (
    <blockquote
      {...props.attributes}
      className="bg-muted p-4 border-s-4 border-primary"
    >
      {props.children}
    </blockquote>
  );
};

const HeadingElement = (props: RenderElementProps) => {
  return (
    <h1 {...props.attributes} className="text-2xl">
      {props.children}
    </h1>
  );
};

const SubHeadingElement = (props: RenderElementProps) => {
  return (
    <h2 {...props.attributes} className="text-xl">
      {props.children}
    </h2>
  );
};

const BulletedListElement = (props: RenderElementProps) => {
  return (
    <ul {...props.attributes} className="list-disc list-inside">
      {props.children}
    </ul>
  );
};

const OrderedListElement = (props: RenderElementProps) => {
  return (
    <ol className="list-decimal list-inside" {...props.attributes}>
      {props.children}
    </ol>
  );
};

const ListElement = (props: RenderElementProps) => {
  return <li {...props.attributes}>{props.children}</li>;
};

const Leaf = (props: RenderLeafProps) => {
  let children = props.children;

  if (props.leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (props.leaf.italic) {
    children = <em>{children}</em>;
  }
  if (props.leaf.underline) {
    children = <u>{children}</u>;
  }
  if (props.leaf.strikethrough) {
    children = <del>{children}</del>;
  }
  if (props.leaf.code) {
    children = <code>{children}</code>;
  }
  return <span {...props.attributes}>{children}</span>;
};

const DetailNews = ({ params }: { params: { slug: string } }) => {
  const [isMounted, setIsMounted] = useState(false);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data, isPending, isSuccess } = useQuery<{
    data: GetNewsDTO;
  }>({
    queryKey: ["news", params.slug],
    queryFn: async () => {
      return await get(`/news/${parseInt(params.slug)}`);
    },
    enabled: isMounted,
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
  if (!isMounted) return null;
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
                    <AvatarFallback className="text-xs font-semibold">
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
            <Slate
              editor={editor}
              initialValue={JSON.parse(data.data.article!.toString())}
            >
              <Editable
                readOnly
                className="text-base antialiased text-primary"
                renderElement={renderElement}
                renderLeaf={renderLeaf}
              />
            </Slate>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default DetailNews;
