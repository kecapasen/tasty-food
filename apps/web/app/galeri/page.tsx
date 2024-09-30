import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
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
export default function Galeri() {
  return (
    <div className="min-h-dvh overflow-x-hidden font-poppins font-bold text-stone-800">
      <Navbar title="GALERI KAMI" />
      <div className="p-16 bg-slate-100">
        <Carousel className="w-full">
          <CarouselContent>
            {Array.from({ length: 1 }).map((_, index) => (
              <CarouselItem key={index}>
                <Card className="overflow-hidden">
                  <CardContent className="flex aspect-video items-center justify-center p-0 relative max-h-[512px] w-full">
                    <Image
                      src={"/ella-olsson-mmnKI8kMxpc-unsplash.jpg"}
                      alt="Dekorasi"
                      className="object-cover"
                      fill
                      priority
                      quality={100}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="p-16 grid grid-cols-4 gap-2">
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
      <Footer />
    </div>
  );
}
