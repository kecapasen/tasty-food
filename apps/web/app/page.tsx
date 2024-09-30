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
const BeritaSeeder = [
  "/sanket-shah-SVA7TyHxojY-unsplash.jpg",
  "/jimmy-dean-Jvw3pxgeiZw-unsplash.jpg",
  "/sebastian-coman-photography-eBmyH7oO5wY-unsplash.jpg",
  "/luisa-brimble-HvXEbkcXjSk-unsplash.jpg",
];
const GaleriSeeder = [
  "/brooke-lark-oaz0raysASk-unsplash.jpg",
  "/ella-olsson-mmnKI8kMxpc-unsplash.jpg",
  "/eiliv-aceron-ZuIDLSz3XLg-unsplash.jpg",
  "/jonathan-borba-Gkc_xM3VY34-unsplash.jpg",
  "/mariana-medvedeva-iNwCO9ycBlc-unsplash.jpg",
  "/monika-grabkowska-P1aohbiT-EY-unsplash.jpg",
];
export default function Home() {
  return (
    <div className="min-h-dvh overflow-x-hidden font-bold text-stone-800 relative">
      <div className="p-4 sm:p-16 bg-slate-100 z-50">
        <div className="relative flex flex-row-reverse sm:flex-row justify-between sm:justify-start items-center gap-2 sm:gap-4">
          <p className="text-lg">TASTY FOOD</p>
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
                  Make changes to your profile here. Click save when you&apos;re
                  done.
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
            <Button variant="link" className="text-sm rounded-none">
              <Link href={"/"}>HOME</Link>
            </Button>
            <Button variant="link" className="text-sm rounded-none">
              <Link href={"/tentang"}>TENTANG</Link>
            </Button>
            <Button variant="link" className="text-sm rounded-none">
              <Link href={"/berita"}>BERITA</Link>
            </Button>
            <Button variant="link" className="text-sm rounded-none">
              <Link href={"/galeri"}>GALERI</Link>
            </Button>
            <Button variant="link" className="text-sm rounded-none">
              <Link href={"/kontak"}>KONTAK</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="px-4 py-16 sm:px-16 bg-slate-100">
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
          <Separator className="h-[2px] w-14 bg-stone-800 rounded-full" />
          <p className="font-normal text-4xl">
            HEALTHY
            <br />
            <span className="font-black">TASTY FOOD</span>
          </p>
          <p className="font-normal text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis odit
            modi quis facere ea dolorem repellat cumque enim, tempore et quidem!
            Nihil deserunt voluptatem veritatis deleniti qui quae eos ad.
          </p>
          <Button className="rounded-none w-48 text-sm bg-stone-950">
            <Link href={"/tentang"} className="text-white">
              TENTANG KAMI
            </Link>
          </Button>
        </div>
      </div>
      <div className="px-4 py-16 sm:px-16 flex justify-center items-center">
        <div className="flex flex-col justify-center items-center gap-4 text-center sm:max-w-[40%]">
          <p className="text-3xl">TENTANG KAMI</p>
          <p className="font-normal text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis odit
            modi quis facere ea dolorem repellat cumque enim, tempore et quidem!
            Nihil deserunt voluptatem veritatis deleniti qui quae eos ad.
          </p>
          <Separator className="h-[2px] w-14 bg-stone-800 rounded-full" />
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
              {Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full md:basis-1/2 lg:basis-1/4"
                >
                  <div>
                    <Card className="flex justify-center items-center relative">
                      <Image
                        src={`/img-${index + 1}.png`}
                        alt="Dekorasi"
                        height={200}
                        width={200}
                        className="absolute -top-[100px]"
                        priority
                        quality={100}
                      />
                      <CardContent className="px-4 py-8 flex flex-col-reverse items-center gap-4 h-64">
                        <p className="font-normal text-sm text-stone-600 text-center">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Numquam deserunt ipsum cum dolorum deleniti,
                          doloribus totam!
                        </p>
                        <p className="text-3xl">LOREM IPSUM</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
              {Array.from({ length: 4 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="basis-full md:basis-1/2 lg:basis-1/4"
                >
                  <div>
                    <Card className="flex justify-center items-center relative">
                      <Image
                        src={`/img-${index + 1}.png`}
                        alt="Dekorasi"
                        height={200}
                        width={200}
                        className="absolute -top-[100px]"
                        priority
                        quality={100}
                      />
                      <CardContent className="px-4 py-8 flex flex-col-reverse items-center gap-4 h-64">
                        <p className="font-normal text-sm text-stone-600 text-center">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit. Numquam deserunt ipsum cum dolorum deleniti,
                          doloribus totam!
                        </p>
                        <p className="text-3xl">LOREM IPSUM</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div className="flex justify-center items-center bg-slate-100">
        <div className="px-4 py-16 sm:px-16 flex flex-col justify-center items-center gap-16 max-w-full">
          <p className="text-3xl text-center">BERITA KAMI</p>
          <div className="grid grid-cols-2 gap-2">
            <Card className="overflow-hidden h-full">
              <CardContent className="flex flex-col p-0 h-full">
                <div className="h-full w-full aspect-square relative">
                  <Image
                    src={"/fathul-abrar-T-qI_MI2EMA-unsplash.jpg"}
                    alt="Dekorasi"
                    fill={true}
                    className="object-cover"
                    priority
                    quality={100}
                  />
                </div>
                <div className="flex flex-col justify-between h-full p-4">
                  <div className="flex flex-col gap-4">
                    <p className="text-2xl">
                      LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT
                    </p>
                    <p className="font-normal text-sm text-stone-600">
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Sit iure totam, ipsum tempore soluta neque maiores fuga.
                      Assumenda deserunt, blanditiis quibusdam, necessitatibus,
                      quaerat cum distinctio ipsum animi nemo veniam dicta.
                      Pariatur deleniti sit aut commodi laudantium. Debitis
                      neque culpa nesciunt temporibus qui sit. Illum dignissimos
                      odio aspernatur. Cum suscipit a, ex illum eligendi
                      mollitia, enim asperiores, facere animi voluptas
                      voluptatum.
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-normal text-sm text-amber-500">
                      Baca selengkapnya
                    </p>
                    <Ellipsis className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-2">
              {BeritaSeeder.map((image: string, index: number) => {
                return (
                  <Card
                    className="flex flex-col overflow-hidden h-full"
                    key={index}
                  >
                    <CardContent className="flex flex-col p-0 h-full">
                      <div className="h-full w-full aspect-video relative">
                        <Image
                          src={image}
                          alt="Dekorasi"
                          fill={true}
                          className="object-cover"
                          priority
                          quality={100}
                        />
                      </div>
                      <div className="flex flex-col justify-between gap-4 h-full p-4">
                        <div className="flex flex-col gap-4">
                          <p className="text-2xl">LOREM IPSUM</p>
                          <p className="font-normal text-sm text-stone-600">
                            Lorem, ipsum dolor sit amet consectetur adipisicing
                            elit. Sit iure totam, ipsum tempore soluta neque
                            maiores fuga.
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-normal text-sm text-amber-500">
                            Baca selengkapnya
                          </p>
                          <Ellipsis className="h-5 w-5" />
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
          <p className="text-3xl">GALERI KAMI</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-2 gap-y-4 w-full">
            {GaleriSeeder.map((item, index) => {
              return (
                <Card
                  key={index}
                  className="flex flex-col overflow-hidden h-full"
                >
                  <CardContent className="flex flex-col p-0 h-full aspect-square relative">
                    <Image
                      src={item}
                      alt="Dekorasi"
                      fill={true}
                      className="w-auto h-full object-cover"
                      priority
                      quality={100}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <Button className="rounded-none w-48 text-sm bg-stone-950">
            LIHAT LEBIH BANYAK
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
