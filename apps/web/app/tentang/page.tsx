import Footer from "@/components/footer";
import Navbar from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Tentang() {
  return (
    <div className="min-h-dvh overflow-x-hidden font-poppins font-bold text-stone-800">
      <Navbar title="TENTANG KAMI" />
      <div className="p-16 grid grid-cols-2 gap-8 bg-slate-100">
        <div className="flex flex-col justify-center gap-8">
          <p className="text-3xl">TASTY FOOD</p>
          <p className="text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
            blanditiis eaque eos minus nulla aperiam ut officia incidunt quaerat
            expedita, culpa, necessitatibus tempora, aut nihil doloremque
            numquam magnam commodi fugit.
          </p>
          <p className="text-sm font-normal">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse
            inventore necessitatibus quia atque similique ex iure quos,
            repudiandae numquam magnam fugiat quidem fugit perspiciatis, odit
            illo, veniam et exercitationem reprehenderit.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0 h-96">
              <Image
                src={"/brooke-lark-oaz0raysASk-unsplash.jpg"}
                alt="Dekorasi"
                height={5760}
                width={3840}
                className="h-full w-full object-cover"
                priority
                quality={100}
              />
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-0 h-96">
              <Image
                src={"/sebastian-coman-photography-eBmyH7oO5wY-unsplash.jpg"}
                alt="Dekorasi"
                height={5813}
                width={4650}
                className="h-full w-full object-cover"
                priority
                quality={100}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="p-16 grid grid-cols-2 gap-8">
        <div className="grid grid-cols-2 gap-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={"/fathul-abrar-T-qI_MI2EMA-unsplash.jpg"}
                alt="Dekorasi"
                height={3795}
                width={2530}
                className="h-full w-full aspect-square object-cover"
                priority
                quality={100}
              />
            </CardContent>
          </Card>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Image
                src={"/michele-blackwell-rAyCBQTH7ws-unsplash.jpg"}
                alt="Dekorasi"
                height={3744}
                width={3744}
                className="h-full w-full aspect-square object-cover"
                priority
                quality={100}
              />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col justify-center gap-8">
          <p className="text-3xl">VISI</p>
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
        </div>
      </div>
      <div className="p-16 grid grid-cols-2 gap-8">
        <div className="flex flex-col justify-center gap-8">
          <p className="text-3xl">MISI</p>
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
        </div>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <Image
              src={"/sanket-shah-SVA7TyHxojY-unsplash.jpg"}
              alt="Dekorasi"
              height={2880}
              width={2160}
              className="h-full w-full aspect-video object-cover"
              priority
              quality={100}
            />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
