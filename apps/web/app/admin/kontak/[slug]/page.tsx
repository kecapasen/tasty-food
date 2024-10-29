"use client";
import React, { useEffect, useState } from "react";
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

const DetailContact = ({ params }: { params: { slug: string } }) => {
  const [isMount, setIsMount] = useState<boolean>(false);
  const { data, isPending } = useQuery<{
    data: GetContactDTO;
  }>({
    queryKey: ["contact"],
    queryFn: async () => {
      return await get(`/contact/${parseInt(params.slug)}`);
    },
  });
  useEffect(() => {
    setIsMount(true);
  }, []);
  if (!isMount) return null;
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
            <div className="flex items-center gap-2 relative">
              <Avatar>
                <AvatarFallback className="text-xs font-semibold">
                  {data!.data.name
                    .split(" ")
                    .map((data: string) => data[0]?.toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <CardDescription className="capitalize">
                    {data.data.name}
                  </CardDescription>
                  <Separator orientation="vertical" className="h-4" />
                  <CardDescription>
                    {data.data.email.toLowerCase()}
                  </CardDescription>
                </div>
                <CardDescription className="text-xs">
                  {format(new Date(data.data.createdAt), "PPPppp", {
                    locale: id,
                  })}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-6">
            <blockquote className="text-sm bg-muted p-4 border-s-4 border-primary">
              {data.data.message}
            </blockquote>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full"
            >
              <SendHorizonal className="h-4 w-4" />
              Balas
            </Button>
          </CardFooter>
        </Card>
      )}
    </Layout>
  );
};

export default DetailContact;
