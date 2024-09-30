import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar({ title }: { title: string }) {
  return (
    <div className="relative flex font-poppins font-bold text-white">
      <Image
        src={"/Group 70@2x.png"}
        alt="Dekoratif"
        height={1422}
        width={3840}
        className="w-full h-auto"
        priority
        quality={100}
      />
      <div className="absolute flex justify-between p-16 w-full z-10">
        <p className="text-3xl">TASTY FOOD</p>
        <div className="hidden sm:flex sm:items-center sm:gap-2 text-stone-200">
          <Button variant="link" className="text-sm rounded-none">
            <Link href={"/"} className="text-white">
              HOME
            </Link>
          </Button>
          <Button variant="link" className="text-sm rounded-none">
            <Link href={"/tentang"} className="text-white">
              TENTANG
            </Link>
          </Button>
          <Button variant="link" className="text-sm rounded-none">
            <Link href={"/berita"} className="text-white">
              BERITA
            </Link>
          </Button>
          <Button variant="link" className="text-sm rounded-none">
            <Link href={"/galeri"} className="text-white">
              GALERI
            </Link>
          </Button>
          <Button variant="link" className="text-sm rounded-none">
            <Link href={"/kontak"} className="text-white">
              KONTAK
            </Link>
          </Button>
        </div>
      </div>
      <div className="absolute flex items-center p-16 w-full h-full">
        <p className="text-4xl font-black">{title}</p>
      </div>
    </div>
  );
}
