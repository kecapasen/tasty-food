"use client";
import React, { Usable, use, useEffect, useState } from "react";
import Layout, { Pages } from "@/components/layout";
import Spinner from "@/components/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GetContactDTO } from "@repo/dto";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { get } from "@/util/http-request";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SendHorizonal } from "lucide-react";

const DetailContact = ({ params }: { params: Usable<{ slug: string }> }) => {
  const { slug } = use<{ slug: string }>(params);
  const { data, isPending } = useQuery<{
    data: GetContactDTO;
  }>({
    queryKey: ["contact"],
    queryFn: async () => {
      return await get(`/contact/${parseInt(slug)}`);
    },
  });
  return (
    <Layout
      active={Pages.CONTACT}
      breadcrumb={[
        { title: "Kontak", href: "/admin/kontak" },
        { title: "Detail kontak" },
      ]}
    >
      {isPending && <Spinner />}
      {!!data?.data && (
        <Card>
          <CardHeader className="flex flex-col gap-2">
            <CardTitle>{data.data.subject}</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 flex flex-col gap-2">
            <div className="flex items-center gap-2 relative">
              <Avatar>
                <AvatarFallback className="font-semibold">
                  {data.data.name
                    .split(" ")
                    .map((data: string) => data[0]?.toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p className="capitalize text-sm font-semibold">
                    {data.data.name}
                  </p>
                  <Separator orientation="vertical" className="h-4" />
                  <p className="text-xs text-muted-foreground">
                    {`<${data.data.email.toLowerCase()}>`}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(data.data.createdAt), "PPPppp", {
                    locale: id,
                  })}
                </p>
              </div>
            </div>
            <blockquote className="text-sm bg-muted p-4 border-s-4 border-primary">
              {data.data.message}
            </blockquote>
          </CardContent>
          <CardFooter>
            <Button
              asChild
              variant="outline"
              className="flex items-center gap-2 w-full"
            >
              <a href={`mailto:${data.data.email}`}>
                Balas
                <SendHorizonal className="h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
      )}
    </Layout>
  );
};

export default DetailContact;
