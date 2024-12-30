"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  use,
  Usable,
} from "react";
import Image from "next/image";
import Layout, { Pages } from "@/components/layout";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from "slate-react";
import { createEditor, Descendant } from "slate";
import { withHistory } from "slate-history";
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { get, patch } from "@/util/http-request";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { GetNewsDTO } from "@repo/dto";
import Spinner from "@/components/spinner";
import {
  BlockButton,
  BlockQuoteElement,
  BulletedListElement,
  DefaultElement,
  HeadingElement,
  isBlockActive,
  isMarkActive,
  Leaf,
  ListElement,
  MarkButton,
  OrderedListElement,
  SubHeadingElement,
  toggleMark,
} from "@/components/slate";
import { newsFormSchema } from "../type";

const EditNews = ({ params }: { params: Usable<{ slug: string }> }) => {
  const { slug } = use<{ slug: string }>(params);
  const [files, setFiles] = useState<Blob[]>([]);
  const initialValue: Descendant[] = useMemo(
    () => [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ],
    []
  );
  const [active, setActive] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    code: false,
    blockquote: false,
    hOne: false,
    hTwo: false,
    bulletedList: false,
    orderedList: false,
  });
  const linkRef = useRef<string | null>(null);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
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
  const onDrop = useCallback((acceptedFiles: Blob[]) => {
    setFiles([acceptedFiles[0]!]);
    linkRef.current = URL.createObjectURL(acceptedFiles[0]!);
  }, []);
  const form = useForm<z.infer<typeof newsFormSchema>>({
    resolver: zodResolver(newsFormSchema),
    defaultValues: {
      title: "",
    },
  });
  const { getRootProps, open } = useDropzone({
    maxFiles: 1,
    noClick: true,
    onDrop,
  });
  const { push } = useRouter();
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof newsFormSchema>) => {
    mutation.mutate(values);
  };
  const updateActive = () => {
    setActive({
      bold: isMarkActive(editor, "bold"),
      italic: isMarkActive(editor, "italic"),
      underline: isMarkActive(editor, "underline"),
      strikethrough: isMarkActive(editor, "strikethrough"),
      code: isMarkActive(editor, "code"),
      blockquote: isBlockActive(editor, "blockquote"),
      hOne: isBlockActive(editor, "heading-one"),
      hTwo: isBlockActive(editor, "heading-two"),
      bulletedList: isBlockActive(editor, "bulleted-list"),
      orderedList: isBlockActive(editor, "numbered-list"),
    });
  };
  const { data, isPending, isSuccess } = useQuery<{
    data: GetNewsDTO;
  }>({
    queryKey: ["news"],
    queryFn: async () => {
      return await get(`/news/${parseInt(slug)}`);
    },
  });
  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof newsFormSchema>) => {
      if (!localStorage.getItem("content")) {
        toast({
          variant: "destructive",
          title: "Tidak ada konten berita",
          description: "Harap isi konten sebelum melanjutkan.",
        });
        return;
      }
      const formData = new FormData();
      files[0] && formData.append("file", files[0]);
      formData.append("title", values.title);
      formData.append("article", localStorage.getItem("content")!);
      return await patch(`/news/${parseInt(slug)}`, formData);
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
      localStorage.setItem("content", JSON.stringify(initialValue));
      push("/admin/berita");
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Gagal!",
        description: error.message || "Terjadi kesalahan, silakan coba lagi.",
        action: (
          <ToastAction
            altText="Coba lagi"
            onClick={() => mutation.mutate(form.getValues())}
          >
            Coba lagi
          </ToastAction>
        ),
      });
    },
  });
  useEffect(() => {
    if (isSuccess && !!data.data) {
      form.setValue("title", data.data.title);
      localStorage.setItem(
        "content",
        data.data.article
          ? data.data.article.toString()
          : JSON.stringify(initialValue)
      );
    }
  }, [isSuccess]);
  return (
    <Layout
      active={Pages.NEWS}
      breadcrumb={[
        { title: "Berita", href: "/admin/berita" },
        { title: "Edit berita" },
      ]}
    >
      {isPending && <Spinner />}
      {isSuccess && !!data.data && (
        <>
          <div className="col-span-1 flex flex-col gap-2">
            <Card
              className="w-full flex justify-center h-96 items-center aspect-video group border-input border-dashed relative bg-white overflow-hidden"
              {...getRootProps()}
            >
              <Image
                src={linkRef.current || data.data.headerImage}
                alt="Dekorasi"
                fill
                className="object-cover"
                priority
                quality={100}
              />
            </Card>
            <Button variant="outline" size="sm" onClick={open}>
              Unggah gambar
            </Button>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              id="newsForm"
              spellCheck="false"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>Masukkan judul berita.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Slate
            editor={editor}
            initialValue={
              data.data.article
                ? JSON.parse(data.data.article!.toString())
                : initialValue
            }
            onChange={(value) => {
              updateActive();
              const isAstChange = editor.operations.some(
                (op) => "set_selection" !== op.type
              );
              if (isAstChange) {
                localStorage.setItem("content", JSON.stringify(value));
              }
            }}
          >
            <div className="flex items-center gap-2">
              <MarkButton
                activeMark={active}
                format="bold"
                icon={<Bold className="h-4w-4" />}
                updateActive={updateActive}
              />
              <MarkButton
                activeMark={active}
                format="italic"
                icon={<Italic className="h-4w-4" />}
                updateActive={updateActive}
              />
              <MarkButton
                activeMark={active}
                format="underline"
                icon={<Underline className="h-4w-4" />}
                updateActive={updateActive}
              />
              <MarkButton
                activeMark={active}
                format="strikethrough"
                icon={<Strikethrough className="h-4w-4" />}
                updateActive={updateActive}
              />
              <MarkButton
                activeMark={active}
                format="code"
                icon={<Code className="h-4w-4" />}
                updateActive={updateActive}
              />
              <BlockButton
                format="heading-one"
                icon={<Heading1 className="h-4w-4" />}
                updateActive={updateActive}
              />
              <BlockButton
                format="heading-two"
                icon={<Heading2 className="h-4w-4" />}
                updateActive={updateActive}
              />
              <BlockButton
                format="numbered-list"
                icon={<ListOrdered className="h-4w-4" />}
                updateActive={updateActive}
              />
              <BlockButton
                format="bulleted-list"
                icon={<List className="h-4w-4" />}
                updateActive={updateActive}
              />
              <BlockButton
                format="blockquote"
                icon={<Quote className="h-4w-4" />}
                updateActive={updateActive}
              />
            </div>
            <Editable
              spellCheck="false"
              className="min-h-[32rem] h-full overflow-y-auto w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              onKeyDown={(event) => {
                if (event.ctrlKey) {
                  switch (event.key) {
                    case "b": {
                      event.preventDefault();
                      toggleMark(editor, "bold");
                      updateActive();
                      break;
                    }
                    case "i": {
                      event.preventDefault();
                      toggleMark(editor, "italic");
                      updateActive();
                      break;
                    }
                    case "u": {
                      event.preventDefault();
                      toggleMark(editor, "underline");
                      updateActive();
                      break;
                    }
                    case "~": {
                      event.preventDefault();
                      toggleMark(editor, "strikethrough");
                      updateActive();
                      break;
                    }
                    case "`": {
                      event.preventDefault();
                      toggleMark(editor, "code");
                      updateActive();
                      break;
                    }
                  }
                }
              }}
            />
          </Slate>
          <Separator />
          <div className="ml-auto">
            <Button
              size="lg"
              type="submit"
              disabled={mutation.isPending}
              form="newsForm"
            >
              Simpan
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default EditNews;
