import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Ellipsis } from "lucide-react";
const ItemsPerPage = 2;
const BeritaSeeder = [
  "/sanket-shah-SVA7TyHxojY-unsplash.jpg",
  "/jimmy-dean-Jvw3pxgeiZw-unsplash.jpg",
  "/sebastian-coman-photography-eBmyH7oO5wY-unsplash.jpg",
  "/luisa-brimble-HvXEbkcXjSk-unsplash.jpg",
  "/sanket-shah-SVA7TyHxojY-unsplash.jpg",
  "/jimmy-dean-Jvw3pxgeiZw-unsplash.jpg",
  "/sebastian-coman-photography-eBmyH7oO5wY-unsplash.jpg",
  "/luisa-brimble-HvXEbkcXjSk-unsplash.jpg",
];
export default function Berita() {
  const numberOfPages = Math.ceil(BeritaSeeder.length / ItemsPerPage);
  return (
    <div className="min-h-dvh overflow-x-hidden font-poppins font-bold text-stone-800">
      <Navbar title="BERITA KAMI" />
      <div className="p-16 grid grid-cols-2 gap-8 bg-slate-100">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src={"/eiliv-aceron-ZuIDLSz3XLg-unsplash.jpg"}
              alt="Dekorasi"
              height={6000}
              width={4000}
              className="h-full w-full aspect-square object-cover"
              priority
              quality={100}
            />
          </CardContent>
        </Card>
        <div className="flex flex-col justify-center gap-8">
          <p className="text-3xl">APA SAJA MAKANAN KHAS NUSANTARA?</p>
          <p className="text-sm font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            quos, perspiciatis reiciendis repudiandae ab facilis sapiente
            mollitia, nesciunt inventore quam, nobis assumenda sint! Magnam, ea?
            Maiores doloremque optio explicabo sit? Adipisci omnis earum
            molestias, accusamus tempora ipsam maiores atque voluptas sit
            tenetur id quis! Totam cupiditate, laudantium eum, dolor a suscipit
            repellendus exercitationem quod iure mollitia illo! Eum, repellat
            maiores?
          </p>
          <p className="text-sm font-normal">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
            quos, perspiciatis reiciendis repudiandae ab facilis sapiente
            mollitia, nesciunt inventore quam, nobis assumenda sint! Magnam, ea?
            Maiores doloremque optio explicabo sit? Adipisci omnis earum
            molestias, accusamus tempora ipsam maiores atque voluptas sit
            tenetur id quis! Totam cupiditate, laudantium eum, dolor a suscipit
            repellendus exercitationem quod iure mollitia illo! Eum, repellat
            maiores?
          </p>
          <Button className="rounded-none w-64 text-sm bg-stone-950">
            BACA SELENGKAPNYA
          </Button>
        </div>
      </div>
      <div className="p-16 flex flex-col justify-center gap-16">
        <p className="text-3xl text-start">BERITA LAINNYA</p>
        <Carousel
          opts={{
            align: "start",
          }}
          className="w-full select-none"
        >
          <CarouselContent className="flex gap-2 m-0">
            {Array.from({ length: numberOfPages }).map((_, pageIndex) => (
              <CarouselItem
                key={pageIndex}
                className="lg:basis-1/4 grid grid-rows-2 gap-2 p-0"
              >
                {BeritaSeeder.slice(
                  pageIndex * ItemsPerPage,
                  (pageIndex + 1) * ItemsPerPage
                ).map((item, index) => (
                  <Card
                    key={index}
                    className="flex flex-col justify-center items-center overflow-hidden"
                  >
                    <CardContent className="flex flex-col p-0">
                      <div className="h-auto w-full aspect-video relative">
                        <Image
                          src={item}
                          alt={`Image for`}
                          fill={true}
                          className="object-cover"
                          priority
                          quality={100}
                        />
                      </div>
                      <div className="flex flex-col gap-8 p-4">
                        <div className="flex flex-col gap-4">
                          <p className="text-3xl">LOREM IPSUM</p>
                          <p className="font-normal text-sm text-stone-600">
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit. Assumenda eveniet atque, odio molestiae
                            voluptatum
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
                ))}
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <Footer />
    </div>
  );
}
