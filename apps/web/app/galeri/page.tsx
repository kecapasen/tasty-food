"use client";
import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { GetGalleryDTO } from "@repo/dto";
import { get } from "@/util/http-request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Spinner from "@/components/spinner";
import { Type } from "@repo/db";

const Galeri = () => {
  const { data, isPending, isSuccess } = useQuery<{
    data: GetGalleryDTO[];
  }>({
    queryKey: ["gallery"],
    queryFn: async () => {
      return await get("/gallery");
    },
  });
  return (
    <div className="overflow-x-hidden">
      {isPending && (
        <div className="h-dvh flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {isSuccess && Array.isArray(data.data) && (
        <>
          <Navbar title="GALERI KAMI" />
          <div className="p-16 bg-secondary">
            <Carousel className="overflow-hidden">
              <CarouselContent className="p-0">
                {data.data
                  .filter((gallery) => gallery.type === Type.SLIDER)
                  .map((item, index) => {
                    return (
                      <CarouselItem key={index}>
                        <div className="flex aspect-video items-center justify-center p-0 relative max-h-[512px] w-full group rounded-xl overflow-hidden">
                          <Image
                            src={item.image}
                            alt="Dekorasi"
                            className="object-cover group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
                            fill
                            priority
                            quality={100}
                          />
                          <div className="absolute -bottom-full left-0 right-0 group-hover:bottom-0 transition-all ease-in-out duration-300 bg-gradient-to-t from-primary w-full z-10 p-4">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={item.user.avatar || undefined}
                                  alt="Dekorator"
                                />
                                <AvatarFallback className="font-semibold text-xs">
                                  {item.user.fullname
                                    .split(" ")
                                    .map((data: string) =>
                                      data[0]?.toUpperCase()
                                    )
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col gap-1">
                                <p className="text-primary-foreground font-semibold text-sm">
                                  {item.user.fullname}
                                </p>
                                <p className="text-muted text-xs">
                                  {formatDistanceToNow(
                                    new Date(item.createdAt),
                                    {
                                      addSuffix: true,
                                      includeSeconds: true,
                                      locale: id,
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="p-16 grid grid-cols-4 gap-2">
            {data.data
              .filter((gallery: GetGalleryDTO) => gallery.type === Type.CONTENT)
              .map((item: GetGalleryDTO, index: number) => {
                return (
                  <Card className="overflow-hidden" key={index}>
                    <CardContent className="flex aspect-square items-center justify-center p-0 relative h-full w-full group">
                      <Image
                        src={item.image}
                        alt="Dekorasi"
                        className="object-cover group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
                        fill
                        priority
                        quality={100}
                      />
                      <div className="absolute -bottom-full left-0 right-0 group-hover:bottom-0 transition-all ease-in-out duration-300 bg-gradient-to-t from-primary w-full z-10 p-4">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={item.user.avatar || undefined}
                              alt="Dekorator"
                            />
                            <AvatarFallback className="font-semibold text-xs">
                              {item.user.fullname
                                .split(" ")
                                .map((data: string) => data[0]?.toUpperCase())
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col gap-1">
                            <p className="text-primary-foreground font-semibold text-sm">
                              {item.user.fullname}
                            </p>
                            <p className="text-muted text-xs">
                              {formatDistanceToNow(new Date(item.createdAt), {
                                addSuffix: true,
                                includeSeconds: true,
                                locale: id,
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
};

export default Galeri;
