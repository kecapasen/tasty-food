"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Menu, Ellipsis } from "lucide-react";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { GetGalleryDTO, GetMenuDTO, GetNewsDTO } from "@repo/dto";
import { get } from "./util/http-request";
import Spinner from "./components/spinner";
import { Type } from "@repo/db";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";
import SlateNews, {
  BlockQuoteElement,
  BulletedListElement,
  HeadingElement,
  Leaf,
  ListElement,
  OrderedListElement,
  SubHeadingElement,
} from "./components/slate";
import {
  DefaultElement,
  Editable,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";

const Home = () => {
  const [isMount, setIsMount] = useState<boolean>(false);
  const [featuredArticle, setFeaturedArticle] = useState<GetNewsDTO | null>(
    null
  );
  const [remainingArticles, setRemainingArticles] = useState<GetNewsDTO[]>([]);
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
  const menu = useQuery<{
    data: GetMenuDTO[];
  }>({
    queryKey: ["menu"],
    queryFn: async () => {
      return await get("/menu");
    },
  });
  const news = useQuery<{
    data: GetNewsDTO[];
  }>({
    queryKey: ["news"],
    queryFn: async () => {
      return await get("/news");
    },
  });
  const gallery = useQuery<{
    data: GetGalleryDTO[];
  }>({
    queryKey: ["gallery"],
    queryFn: async () => {
      return await get("/gallery");
    },
  });
  useEffect(() => {
    if (news.data?.data) {
      try {
        const newsArray = news.data.data;
        if (newsArray.length > 0) {
          const [firstArticle, ...restArticles] = newsArray;
          setFeaturedArticle(firstArticle!);
          setRemainingArticles(restArticles.slice(0, 4));
        } else {
          setFeaturedArticle(null);
          setRemainingArticles([]);
        }
      } catch (error) {
        console.error("Error processing news data:", error);
        setFeaturedArticle(null);
        setRemainingArticles([]);
      }
    }
  }, [news.data]);
  useEffect(() => {
    setIsMount(true);
  }, []);
  if (!isMount) return null;
  return (
    <>
      {(menu.isPending || news.isPending || gallery.isPending) && (
        <div className="h-dvh flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {menu.data &&
        featuredArticle &&
        remainingArticles.length > 0 &&
        gallery.data && (
          <div className="min-h-dvh overflow-x-hidden relative">
            <div className="p-4 sm:p-16 bg-secondary z-50">
              <div className="relative flex flex-row-reverse sm:flex-row justify-between sm:justify-start items-center gap-2 sm:gap-4">
                <p className="font-bold text-lg">TASTY FOOD</p>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="inline sm:hidden p-0">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Edit profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when
                        you&apos;re done.
                      </SheetDescription>
                    </SheetHeader>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button type="submit">Save changes</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
                <div className="hidden sm:flex sm:items-center sm:gap-2">
                  <Button
                    variant="link"
                    className="font-bold text-sm rounded-none"
                  >
                    <a href={"/"}>HOME</a>
                  </Button>
                  <Button
                    variant="link"
                    className="font-bold text-sm rounded-none"
                  >
                    <a href={"/tentang"}>TENTANG</a>
                  </Button>
                  <Button
                    variant="link"
                    className="font-bold text-sm rounded-none"
                  >
                    <a href={"/berita"}>BERITA</a>
                  </Button>
                  <Button
                    variant="link"
                    className="font-bold text-sm rounded-none"
                  >
                    <a href={"/galeri"}>GALERI</a>
                  </Button>
                  <Button
                    variant="link"
                    className="font-bold text-sm rounded-none"
                  >
                    <a href={"/kontak"}>KONTAK</a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="px-4 py-16 sm:px-16 bg-secondary">
              <div className="hidden sm:block absolute -top-32 -right-32 h-[600px] w-[600px]">
                <Image
                  src="/img-4-2000x2000.png"
                  alt="Dekoratif"
                  height={600}
                  width={600}
                  priority
                  quality={100}
                />
              </div>
              <div className="flex flex-col justify-start gap-4 sm:max-w-[40%]">
                <Separator className="h-[2px] w-14 bg-primary rounded-full" />
                <p className="text-4xl">
                  HEALTHY
                  <br />
                  <span className="font-black">TASTY FOOD</span>
                </p>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
                  odit modi quis facere ea dolorem repellat cumque enim, tempore
                  et quidem! Nihil deserunt voluptatem veritatis deleniti qui
                  quae eos ad.
                </p>
                <Button className="rounded-none w-48 text-sm bg-stone-950">
                  <a href={"/tentang"} className="font-bold text-white ">
                    TENTANG KAMI
                  </a>
                </Button>
              </div>
            </div>
            <div className="px-4 py-16 sm:px-16 flex justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-4 text-center sm:max-w-[40%]">
                <p className="text-3xl font-bold">TENTANG KAMI</p>
                <p className="text-sm">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis
                  odit modi quis facere ea dolorem repellat cumque enim, tempore
                  et quidem! Nihil deserunt voluptatem veritatis deleniti qui
                  quae eos ad.
                </p>
                <Separator className="h-[2px] w-14 bg-primary rounded-full" />
              </div>
            </div>
            <div className="flex justify-center items-center relative h-[512px] sm:h-auto">
              <Image
                src={"/Group 70@2x.png"}
                alt="Dekoratif"
                height={1422}
                width={3840}
                className="w-full h-full object-cover"
                priority
                quality={100}
              />
              <div className="absolute flex justify-center items-center px-4 py-16 sm:px-16 max-w-full">
                <Carousel
                  opts={{
                    align: "start",
                  }}
                  className="w-full select-none"
                >
                  <CarouselContent>
                    {menu.data.data.map((item, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-full md:basis-1/2 lg:basis-1/4"
                      >
                        <div>
                          <Card className="flex justify-center items-center relative z-50">
                            <Image
                              src={item.image}
                              alt="Dekorasi"
                              height={200}
                              width={200}
                              className="absolute -top-[100px]"
                              priority
                              quality={100}
                            />
                            <CardContent className="px-4 py-8 flex flex-col-reverse items-center gap-4 h-64">
                              <p className="font-normal text-sm text-center">
                                {item.description}
                              </p>
                              <p className="font-bold text-3xl">{item.name}</p>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
            <div className="flex justify-center items-center bg-secondary">
              <div className="px-4 py-16 sm:px-16 flex flex-col justify-center items-center gap-16 max-w-full">
                <p className="font-bold text-3xl text-center">BERITA KAMI</p>
                <div className="grid grid-cols-2 gap-2">
                  <Card className="overflow-hidden h-full group">
                    <CardContent className="flex flex-col p-0 h-full">
                      <div className="h-full w-full aspect-square relative overflow-hidden">
                        <Image
                          src={featuredArticle.headerImage}
                          alt="Dekorasi"
                          fill={true}
                          className="object-cover group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
                          priority
                          quality={100}
                        />
                      </div>
                      <div className="flex flex-col justify-between h-full p-4">
                        <div className="flex flex-col gap-4">
                          <p className="font-bold text-2xl">
                            {featuredArticle.title}
                          </p>
                          <SlateNews item={featuredArticle}>
                            <Editable
                              readOnly
                              className="font-poppins text-sm antialiased text-primary line-clamp-5"
                              renderElement={renderElement}
                              renderLeaf={renderLeaf}
                            />
                          </SlateNews>
                        </div>
                        <div className="flex justify-between items-center">
                          <a
                            href={`/berita/${featuredArticle.id}`}
                            className="text-sm text-amber-500"
                          >
                            Baca selengkapnya
                          </a>
                          <Ellipsis className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="grid grid-cols-2 grid-rows-2 gap-2">
                    {remainingArticles.length > 0 &&
                      remainingArticles.map((item, index) => {
                        return (
                          <Card
                            className="flex flex-col overflow-hidden h-full group"
                            key={index}
                          >
                            <CardContent className="flex flex-col p-0 h-full">
                              <div className="h-full w-full aspect-video relative overflow-hidden">
                                <Image
                                  src={item.headerImage}
                                  alt="Dekorasi"
                                  fill={true}
                                  className="object-cover group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
                                  priority
                                  quality={100}
                                />
                              </div>
                              <div className="flex flex-col justify-between gap-4 h-full p-4">
                                <div className="flex flex-col gap-4">
                                  <p className="font-bold text-2xl">
                                    {item.title}
                                  </p>
                                  <SlateNews item={item}>
                                    <Editable
                                      readOnly
                                      className="font-poppins text-sm antialiased text-primary line-clamp-4"
                                      renderElement={renderElement}
                                      renderLeaf={renderLeaf}
                                    />
                                  </SlateNews>
                                </div>
                                <div className="flex justify-between items-center">
                                  <a
                                    href={`/berita/${item.id}`}
                                    className="text-sm text-amber-500"
                                  >
                                    Baca selengkapnya
                                  </a>
                                  <Ellipsis className="h-4 w-4" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <div className="px-4 py-16 sm:px-16 flex flex-col justify-center items-center gap-16 w-full">
                <p className="font-bold text-3xl">GALERI KAMI</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-4 w-full">
                  {gallery.data.data
                    .filter((value) => value.type === Type.CONTENT)
                    .map((item, index) => {
                      return (
                        <Card
                          key={index}
                          className="flex flex-col overflow-hidden h-full"
                        >
                          <CardContent className="flex flex-col p-0 h-full aspect-square relative group">
                            <Image
                              src={item.image}
                              alt="Dekorasi"
                              fill={true}
                              className="object-cover group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
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
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
                <Button className="font-bold rounded-none w-48 text-sm bg-stone-950">
                  LIHAT LEBIH BANYAK
                </Button>
              </div>
            </div>
            <Footer />
          </div>
        )}
    </>
  );
};

export default Home;
