"use client";
import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Layout, { Pages } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ImagePlus, ImageUp, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDropzone } from "react-dropzone";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { del, get, post } from "@/util/http-request";
import { Type } from "@repo/db";
import { GetGalleryDTO } from "@repo/dto";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Spinner from "@/components/spinner";

const Gallery = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [contentFiles, setContentFiles] = useState<Blob[]>([]);
  const linkRefContent = useRef<string[]>([]);
  const onDropSlider = useCallback((acceptedFiles: Blob[]) => {
    mutation.mutate({ files: [...acceptedFiles], type: Type.SLIDER });
  }, []);
  const onDropContent = useCallback((acceptedFiles: Blob[]) => {
    setContentFiles((prev) => [...prev, ...acceptedFiles]);
    linkRefContent.current = [
      ...linkRefContent.current,
      ...acceptedFiles.map((file) => URL.createObjectURL(file)),
    ];
  }, []);
  const queryClient = useQueryClient();
  const slider = useDropzone({
    onDrop: onDropSlider,
  });
  const content = useDropzone({
    onDrop: onDropContent,
  });
  const { toast } = useToast();
  const { data, isPending, isSuccess } = useQuery<{
    data: GetGalleryDTO[];
  }>({
    queryKey: ["getGallery"],
    queryFn: async () => {
      return await get("/gallery");
    },
  });
  const mutationDel = useMutation({
    mutationFn: async (id: number) => {
      return await del(`/gallery/${id}`);
    },
    onMutate: () => {
      toast({
        title: "Mohon tunggu...",
        description: "Mohon tunggu, proses sedang berlangsung.",
      });
    },
    onSuccess: (data: { statusCode: number; message: string }) => {
      toast({
        title: "Sukses!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["getGallery"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
      });
    },
  });
  const mutation = useMutation({
    mutationFn: async ({ files, type }: { files: Blob[]; type: Type }) => {
      if (files.length < 1) {
        toast({
          variant: "destructive",
          title: "Tidak ada file",
          description: "Harap pilih file sebelum melanjutkan.",
        });
        return;
      }
      const formData = new FormData();
      files.map((data: Blob) => formData.append("files", data));
      formData.append("type", type);
      return await post("/gallery", formData);
    },
    onMutate: () => {
      toast({
        title: "Mohon tunggu...",
        description: "Mohon tunggu, proses sedang berlangsung.",
      });
    },
    onSuccess: (data: { statusCode: number; message: string }) => {
      toast({
        title: "Sukses!",
        description: data.message,
      });
      queryClient.invalidateQueries({ queryKey: ["getGallery"] });
      setIsOpen(false);
      setContentFiles([]);
      linkRefContent.current = [];
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
      });
    },
  });
  return (
    <Layout active={Pages.GALLERY} breadcrumb={[{ title: "Galeri" }]}>
      {isPending && <Spinner />}
      <div className="flex flex-col gap-4">
        <>
          <Carousel className="overflow-hidden">
            <CarouselContent className="p-0">
              {isSuccess &&
                data.data.length > 0 &&
                data.data
                  .filter((gallery) => gallery.type === Type.SLIDER)
                  .map((item, index) => {
                    return (
                      <CarouselItem key={index}>
                        <div className="flex aspect-video items-center justify-center relative max-h-[512px] w-full group rounded-xl overflow-hidden">
                          <Image
                            src={item.image}
                            alt="Dekorasi"
                            className="object-cover group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
                            fill
                            priority
                            quality={100}
                          />
                          <div className="absolute flex justify-end -top-full left-0 right-0 group-hover:top-0 transition-all ease-in-out duration-300 bg-gradient-to-b from-primary w-full z-10 p-4">
                            <Button
                              size="icon"
                              className="rounded-full bg-destructive hover:bg-destructive/90"
                              onClick={() => mutationDel.mutate(item.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive-foreground" />
                            </Button>
                          </div>
                          <div className="absolute -bottom-full left-0 right-0 group-hover:bottom-0 transition-all ease-in-out duration-300 bg-gradient-to-t from-primary w-full z-10 p-4">
                            <div className="flex items-center gap-2">
                              <Avatar>
                                <AvatarImage
                                  src={item.user.avatar || undefined}
                                  alt="Dekorator"
                                />
                                <AvatarFallback className="font-semibold">
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
              <CarouselItem>
                <Card
                  {...slider.getRootProps()}
                  className="flex aspect-video items-center justify-center relative max-h-[512px] h-full w-full border-2 border-dashed bg-muted cursor-pointer"
                >
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <ImageUp className="h-16 w-16" />
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex items-center gap-2"
                variant="outline"
                size="sm"
              >
                <ImagePlus className="h-4 w-4" />
                Tambah foto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white font-poppins">
              <DialogHeader>
                <DialogTitle>Tambah foto galeri</DialogTitle>
                <DialogDescription>
                  Unggah foto untuk galeri restoran.
                </DialogDescription>
              </DialogHeader>
              <Carousel className="w-full overflow-hidden">
                <CarouselContent className="p-0">
                  {linkRefContent.current?.length > 0 &&
                    linkRefContent.current.map(
                      (link: string, index: number) => (
                        <CarouselItem key={index}>
                          <Card className="overflow-hidden select-none">
                            <CardContent className="flex aspect-square items-center justify-center p-6 relative">
                              <Image
                                src={link}
                                alt="Dekorasi"
                                fill
                                className="object-cover"
                                priority
                                quality={100}
                              />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      )
                    )}
                  <CarouselItem>
                    <Card
                      {...content.getRootProps()}
                      className="border-dashed bg-muted cursor-pointer"
                    >
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <ImageUp className="h-16 w-16" />
                      </CardContent>
                    </Card>
                  </CarouselItem>
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <DialogFooter>
                <Button
                  onClick={async () => {
                    mutation.mutate({
                      files: contentFiles,
                      type: Type.CONTENT,
                    });
                  }}
                  disabled={mutation.isPending}
                >
                  Simpan foto
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <div className="grid grid-cols-4 gap-2">
            {isSuccess &&
              data.data.length > 0 &&
              data.data
                .filter(
                  (gallery: GetGalleryDTO) => gallery.type === Type.CONTENT
                )
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
                        <div className="absolute flex justify-end -top-full left-0 right-0 group-hover:top-0 transition-all ease-in-out duration-300 bg-gradient-to-b from-primary w-full z-10 p-4">
                          <Button
                            size="icon"
                            className="rounded-full bg-destructive hover:bg-destructive/90"
                            onClick={() => mutationDel.mutate(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive-foreground" />
                          </Button>
                        </div>
                        <div className="absolute -bottom-full left-0 right-0 group-hover:bottom-0 transition-all ease-in-out duration-300 bg-gradient-to-t from-primary w-full z-10 p-4">
                          <div className="flex items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={item.user.avatar || undefined}
                                alt="Dekorator"
                              />
                              <AvatarFallback className="font-semibold">
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
        </>
      </div>
    </Layout>
  );
};

export default Gallery;
