"use client";
import React, { useCallback, useState } from "react";
import Image from "next/image";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDropzone } from "react-dropzone";

const AddMenu = () => {
  const [files, setFiles] = useState<Blob[] | []>([]);
  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    acceptedFiles.map((file: Blob) => {
      setFiles([file]);
    });
  }, []);
  const { getRootProps, open } = useDropzone({
    maxFiles: 1,
    noClick: true,
    onDrop,
  });
  return (
    <Layout
      breadcrumb={[
        { title: "Menu", href: "/admin/menu" },
        { title: "Tambah menu" },
      ]}
    >
      <div className="grid grid-cols-4 gap-4 justify-between md:justify-start">
        <div className="col-span-1 flex flex-col gap-2">
          <Card
            className="w-full flex justify-center items-center h-48 aspect-square group border-dashed relative bg-white"
            {...getRootProps()}
          >
            <Image
              src={
                files.length >= 1
                  ? URL.createObjectURL(files[0]!)
                  : "https://placehold.co/192x192/FFF/000000.png"
              }
              alt="Dekorasi"
              fill={true}
              className={`object-contain ${files.length < 1 && "hidden"}`}
              priority
              quality={100}
            />
            <p
              className={`text-xl font-bold ${files.length < 1 ? "block" : "hidden"}`}
            >
              192 x 192
            </p>
          </Card>
          <Button variant="outline" size="sm" onClick={open}>
            Unggah gambar
          </Button>
        </div>
        <div className="col-span-3"></div>
      </div>
    </Layout>
  );
};

export default AddMenu;
