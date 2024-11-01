"use client";
import Image from "next/image";
import Footer from "@/components/footer";
import Navbar from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { GetNewsDTO } from "@repo/dto";
import { get } from "@/util/http-request";
import { useCallback, useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import SlateNews, {
  BlockQuoteElement,
  BulletedListElement,
  HeadingElement,
  Leaf,
  ListElement,
  OrderedListElement,
  SubHeadingElement,
} from "@/components/slate";
import {
  DefaultElement,
  Editable,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
export default function Berita() {
  const [isMount, setIsMount] = useState<boolean>(false);
  const [featuredArticle, setFeaturedArticle] = useState<GetNewsDTO | null>(
    null
  );
  const [remainingArticles, setRemainingArticles] = useState<GetNewsDTO[]>([]);
  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "heading-one":
        return <HeadingElement {...props} />;
      case "heading-two":
        return <SubHeadingElement {...props} />;
      case "bulleted-list":
        return <BulletedListElement {...props} />;
      case "numbered-list":
        return <OrderedListElement {...props} />;
      case "list-item":
        return <ListElement {...props} />;
      case "blockquote":
        return <BlockQuoteElement {...props} />;
      case "paragraph":
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);
  const { data, isPending } = useQuery<{
    data: GetNewsDTO[];
  }>({
    queryKey: ["gallery"],
    queryFn: async () => {
      return await get("/news");
    },
    enabled: isMount,
  });
  useEffect(() => {
    setIsMount(true);
  }, []);
  useEffect(() => {
    if (data?.data) {
      try {
        const newsArray = data.data;
        if (newsArray.length > 0) {
          const [firstArticle, ...restArticles] = newsArray;
          setFeaturedArticle(firstArticle!);
          setRemainingArticles(restArticles.slice(0, 4));
        } else {
          setFeaturedArticle(null);
          setRemainingArticles([]);
        }
      } catch (error) {
        setFeaturedArticle(null);
        setRemainingArticles([]);
      }
    }
  }, [data]);
  if (!isMount) return null;
  return (
    <div className="overflow-x-hidden">
      {isPending && (
        <div className="h-dvh flex justify-center items-center">
          <Spinner />
        </div>
      )}
      {featuredArticle && (
        <>
          <Navbar title="BERITA KAMI" />
          <div className="p-16 grid grid-cols-2 gap-8 bg-secondary">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={featuredArticle.headerImage}
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
              <p className="text-3xl font-bold">{featuredArticle.title}</p>
              <SlateNews item={featuredArticle}>
                <Editable
                  readOnly
                  className="font-poppins text-sm antialiased text-primary line-clamp-[16]"
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                />
              </SlateNews>
              <Button
                asChild
                className="rounded-none w-64 text-sm bg-stone-950"
              >
                <a href={`/berita/${featuredArticle.id}`}>BACA SELENGKAPNYA</a>
              </Button>
            </div>
          </div>
          <div className="p-16 flex flex-col justify-center gap-16">
            <p className="text-3xl text-start font-bold">BERITA LAINNYA</p>
            {remainingArticles.length > 0 &&
              remainingArticles.map((item, index) => (
                <div key={index} className="grid grid-cols-4 gap-2">
                  <Card className="flex flex-col justify-center items-center overflow-hidden group">
                    <CardContent className="flex flex-col p-0">
                      <div className="h-auto w-full aspect-video relative overflow-hidden">
                        <Image
                          src={item.headerImage}
                          alt="Dekorasi"
                          fill={true}
                          className="object-cover group-hover:brightness-75 group-hover:scale-110 transition-all duration-300 ease-in-out"
                          priority
                          quality={100}
                        />
                      </div>
                      <div className="flex flex-col gap-8 p-4">
                        <div className="flex flex-col gap-4">
                          <p className="text-3xl font-bold">{item.title}</p>
                          <SlateNews item={item}>
                            <Editable
                              readOnly
                              className="font-poppins text-sm antialiased text-primary line-clamp-4"
                              renderElement={renderElement}
                              renderLeaf={renderLeaf}
                            />
                          </SlateNews>
                        </div>
                        <div className="flex justify-between items-center">
                          <a
                            href={`/berita/${item.id}`}
                            className="text-sm text-amber-500"
                          >
                            Baca selengkapnya
                          </a>
                          <Ellipsis className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
          <Footer />
        </>
      )}
    </div>
  );
}
