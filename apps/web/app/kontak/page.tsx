import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Kontak() {
  return (
    <div className="min-h-dvh overflow-x-hidden font-poppins font-bold text-stone-800">
      <Navbar title="KONTAK KAMI" />
      <div className="p-16 flex flex-col justify-center gap-16">
        <p className="text-3xl text-start">KONTAK KAMI</p>
        <div className="flex flex-col gap-8 items-center">
          <div className="grid grid-cols-2 gap-2 text-sm font-normal w-full">
            <div className="flex flex-col gap-2">
              <Input type="text" placeholder="Subject" className="py-8 px-4" />
              <Input type="text" placeholder="Nama" className="py-8 px-4" />
              <Input type="email" placeholder="Email" className="py-8 px-4" />
            </div>
            <Textarea placeholder="Message" className="p-4" />
          </div>
          <Button className="w-full text-sm bg-stone-950 p-8">KIRIM</Button>
        </div>
      </div>
      <div className="p-16 flex justify-evenly items-center">
        <div className="flex flex-col gap-2 items-center">
          <Image
            src={"/Group 66@2x.png"}
            alt="Dekorasi"
            height={48}
            width={48}
            priority
            quality={100}
          />
          <p className="text-lg">Email</p>
          <p className="text-sm font-normal">tastyfood@tastyfood.com</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Image
            src={"/Group 67@2x.png"}
            alt="Dekorasi"
            height={48}
            width={48}
            priority
            quality={100}
          />
          <p className="text-lg">Phone</p>
          <p className="text-sm font-normal">+62 812 3456 7890</p>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Image
            src={"/Group 68@2x.png"}
            alt="Dekorasi"
            height={48}
            width={48}
            priority
            quality={100}
          />
          <p className="text-lg">Lokasi</p>
          <p className="text-sm font-normal">Kota Bandung, Jawa Barat</p>
        </div>
      </div>
      <div className="p-16">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2097.68975289662!2d107.30044364289157!3d-7.019756718228912!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68f791f68958bf%3A0x2e49f652a8e01da3!2sTasty%20Food!5e0!3m2!1sid!2sid!4v1719037251462!5m2!1sid!2sid"
          className="border-0 h-[512px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <Footer />
    </div>
  );
}
