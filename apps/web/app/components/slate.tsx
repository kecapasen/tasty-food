import { GetNewsDTO } from "@repo/dto";
import React, { ReactNode, useCallback, useMemo } from "react";
import { BaseEditor, createEditor } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";

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

const SlateNews = ({
  item,
  children,
}: {
  item: GetNewsDTO;
  children: ReactNode;
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return (
    <Slate editor={editor} initialValue={JSON.parse(item.article!.toString())}>
      {children}
    </Slate>
  );
};

export const DefaultElement = (props: RenderElementProps) => {
  return <p {...props.attributes}>{props.children}</p>;
};
export const BlockQuoteElement = (props: RenderElementProps) => {
  return (
    <blockquote
      {...props.attributes}
      className="bg-muted p-4 border-s-4 border-primary"
    >
      {props.children}
    </blockquote>
  );
};
export const HeadingElement = (props: RenderElementProps) => {
  return (
    <h1 {...props.attributes} className="text-2xl">
      {props.children}
    </h1>
  );
};
export const SubHeadingElement = (props: RenderElementProps) => {
  return (
    <h2 {...props.attributes} className="text-xl">
      {props.children}
    </h2>
  );
};
export const BulletedListElement = (props: RenderElementProps) => {
  return (
    <ul {...props.attributes} className="list-disc list-inside">
      {props.children}
    </ul>
  );
};
export const OrderedListElement = (props: RenderElementProps) => {
  return (
    <ol className="list-decimal list-inside" {...props}>
      {props.children}
    </ol>
  );
};
export const ListElement = (props: RenderElementProps) => {
  return <li {...props.attributes}>{props.children}</li>;
};
export const Leaf = (props: RenderLeafProps) => {
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

export default SlateNews;
