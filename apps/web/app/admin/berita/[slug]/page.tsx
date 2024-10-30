"use client";
import React, {
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import Image from "next/image";
import Layout, { Pages } from "@/components/layout";
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
  useSlate,
} from "slate-react";
import {
  BaseEditor,
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element,
} from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import { Toggle } from "@/components/ui/toggle";
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

type BlockFormat =
  | "heading-one"
  | "heading-two"
  | "bulleted-list"
  | "numbered-list"
  | "list-item"
  | "blockquote"
  | "paragraph";
type MarkFormat = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};
type ActiveMark = Record<keyof MarkFormat, boolean>;
type CustomElement = {
  type: BlockFormat;
  children: CustomText[];
};
type CustomText = MarkFormat & {
  text: string;
};
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const newsFormSchema = z.object({
  title: z.string().min(1, { message: "Judul harus diisi." }),
});
const LIST_TYPES = ["numbered-list", "bulleted-list"];

const EditNews = ({ params }: { params: { slug: string } }) => {
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
      return await get(`/news/${parseInt(params.slug)}`);
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
      return await patch(`/news/${parseInt(params.slug)}`, formData);
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
          ? data.data.article!.toString()
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
const toggleBlock = (editor: Editor, format: BlockFormat) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);
  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });
  let newProperties: Partial<Element>;
  newProperties = {
    type: isActive ? "paragraph" : isList ? "list-item" : format,
  };
  Transforms.setNodes<Element>(editor, newProperties);
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};
const toggleMark = (editor: Editor, format: keyof MarkFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
const isBlockActive = (editor: Editor, format: BlockFormat) => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
    })
  );
  return !!match;
};
const isMarkActive = (editor: Editor, format: keyof MarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};
const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};
const BlockQuoteElement = (props: RenderElementProps) => {
  return (
    <blockquote
      {...props.attributes}
      className="bg-muted p-4 border-s-4 border-primary"
    >
      {props.children}
    </blockquote>
  );
};
const HeadingElement = (props: RenderElementProps) => {
  return (
    <h1 {...props.attributes} className="text-2xl">
      {props.children}
    </h1>
  );
};
const SubHeadingElement = (props: RenderElementProps) => {
  return (
    <h2 {...props.attributes} className="text-xl">
      {props.children}
    </h2>
  );
};
const BulletedListElement = (props: RenderElementProps) => {
  return (
    <ul {...props.attributes} className="list-disc list-inside">
      {props.children}
    </ul>
  );
};
const OrderedListElement = (props: RenderElementProps) => {
  return (
    <ol className="list-decimal list-inside" {...props}>
      {props.children}
    </ol>
  );
};
const ListElement = (props: RenderElementProps) => {
  return <li {...props.attributes}>{props.children}</li>;
};
const Leaf = (props: RenderLeafProps) => {
  let children = props.children;

  if (props.leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (props.leaf.italic) {
    children = <em>{children}</em>;
  }
  if (props.leaf.underline) {
    children = <u>{children}</u>;
  }
  if (props.leaf.strikethrough) {
    children = <del>{children}</del>;
  }
  if (props.leaf.code) {
    children = <code>{children}</code>;
  }
  return <span {...props.attributes}>{children}</span>;
};
const BlockButton = (props: {
  updateActive: () => void;
  format: BlockFormat;
  icon: ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Toggle
      variant="outline"
      pressed={isBlockActive(editor, props.format)}
      aria-label="Toggle bold"
      onPressedChange={() => {
        toggleBlock(editor, props.format);
        props.updateActive();
      }}
    >
      {props.icon}
    </Toggle>
  );
};
const MarkButton = (props: {
  activeMark: ActiveMark;
  updateActive: () => void;
  format: keyof MarkFormat;
  icon: ReactNode;
}) => {
  const editor = useSlate();
  return (
    <Toggle
      variant="outline"
      pressed={!!props.activeMark[props.format as keyof MarkFormat]}
      aria-label="Toggle bold"
      onPressedChange={() => {
        toggleMark(editor, props.format);
        props.updateActive();
      }}
    >
      {props.icon}
    </Toggle>
  );
};

export default EditNews;
