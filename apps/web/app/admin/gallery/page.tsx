import React from "react";
import Image from "next/image";
import Layout from "@/components/layout";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
const GaleriSeeder = [
  "/anh-nguyen-kcA-c3f_3FE-unsplash.jpg",
  "/anna-pelzer-IGfIGP5ONV0-unsplash.jpg",
  "/brooke-lark-1Rm9GLHV0UA-unsplash.jpg",
  "/brooke-lark-nBtmglfY0HU-unsplash.jpg",
  "/brooke-lark-oaz0raysASk-unsplash.jpg",
  "/eiliv-aceron-ZuIDLSz3XLg-unsplash.jpg",
  "/fathul-abrar-T-qI_MI2EMA-unsplash.jpg",
  "/jimmy-dean-Jvw3pxgeiZw-unsplash.jpg",
  "/luisa-brimble-HvXEbkcXjSk-unsplash.jpg",
  "/sebastian-coman-photography-eBmyH7oO5wY-unsplash.jpg",
  "/sanket-shah-SVA7TyHxojY-unsplash.jpg",
  "/monika-grabkowska-P1aohbiT-EY-unsplash.jpg",
];
const Gallery = () => {
  return (
    <Layout breadcrumb="Galeri">
      <Separator />
      <div className="flex flex-col gap-4">
        <Card className="w-full overflow-hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {Array.from({ length: 1 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="flex aspect-video items-center justify-center p-0 relative max-h-[512px] w-full overflow-hidden"
                >
                  <Image
                    src={"/ella-olsson-mmnKI8kMxpc-unsplash.jpg"}
                    alt="Dekorasi"
                    className="object-cover rounded-xl"
                    fill
                    priority
                    quality={100}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </Card>
        <Button className="flex items-center gap-2" variant="outline" size="sm">
          <ImagePlus className="h-5 w-5" />
          Tambah foto
        </Button>
        <div className="grid grid-cols-4 gap-2">
          {GaleriSeeder.map((item, index) => {
            return (
              <Card className="overflow-hidden" key={index}>
                <CardContent className="flex aspect-square items-center justify-center p-0 relative h-full w-full">
                  <Image
                    src={item}
                    alt="Dekorasi"
                    className="object-cover"
                    fill
                    priority
                    quality={100}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Gallery;
