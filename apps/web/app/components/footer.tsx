"use client";
import { get } from "@/util";
import { GetSiteDTO } from "@repo/dto";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Spinner from "./spinner";

const Footer = () => {
  const site = useQuery<{
    data: GetSiteDTO;
  }>({
    queryKey: ["site"],
    queryFn: async () => {
      return await get("/site");
    },
  });
  return (
    <>
      {site.isPending && (
        <div className="h-dvh flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {site.data && (
        <div className="flex flex-col font-poppins font-bold text-white bg-stone-950">
          <div className="px-4 pt-16 sm:p-16 flex flex-col sm:flex-row gap-8 sm:gap-0 justify-between">
            <div className="flex flex-col gap-4 sm:gap-8 w-full sm:max-w-[40%]">
              <p className="text-3xl">Tasty Food</p>
              <p className="font-normal text-sm text-stone-200">
                {site.data.data.aboutUs}
              </p>
              <div className="flex items-center gap-4">
                <Image
                  src={"/001-facebook@2x.png"}
                  alt=""
                  height={48}
                  width={48}
                  priority
                  quality={100}
                />
                <Image
                  src={"/002-twitter@2x.png"}
                  alt=""
                  height={48}
                  width={48}
                  priority
                  quality={100}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-8">
              <p className="text-lg">Useful Links</p>
              <div className="flex flex-col gap-4">
                <p className="font-normal text-sm">Blog</p>
                <p className="font-normal text-sm">Hewan</p>
                <p className="font-normal text-sm">Galeri</p>
                <p className="font-normal text-sm">Testimonial</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-8">
              <p className="text-lg">Privacy</p>
              <div className="flex flex-col gap-4">
                <p className="font-normal text-sm">Kasir</p>
                <p className="font-normal text-sm">Tentang Kami</p>
                <p className="font-normal text-sm">Kontak Kami</p>
                <p className="font-normal text-sm">Servis</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:gap-8">
              <p className="text-lg">Contact Info</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={"/Group 66@2x.png"}
                    alt=""
                    height={32}
                    width={32}
                    priority
                    quality={100}
                  />
                  <p className="font-normal text-sm">{site.data.data.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={"/Group 67@2x.png"}
                    alt=""
                    height={32}
                    width={32}
                    priority
                    quality={100}
                  />
                  <p className="font-normal text-sm">{`+62 ${site.data.data.contact}`}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src={"/Group 68@2x.png"}
                    alt=""
                    height={32}
                    width={32}
                    priority
                    quality={100}
                  />
                  <p className="font-normal text-sm">
                    {site.data.data.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center p-8">
            <p className="font-normal text-sm text-stone-200">
              &copy; {new Date().getFullYear().toString()} Rizky Maulana. All
              rights reserved
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
