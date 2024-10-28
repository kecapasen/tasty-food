import { GetNewsDTO } from "@repo/dto";
import React, { useCallback, useMemo } from "react";
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
  lineClamp,
}: {
  item: GetNewsDTO;
  lineClamp?: number;
}) => {
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
  return (
    <Slate editor={editor} initialValue={JSON.parse(item.article!.toString())}>
      <Editable
        readOnly
        className={`font-poppins text-sm antialiased text-primary ${lineClamp ? `line-clamp-[${lineClamp}]` : "line-clamp-4"}`}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
      />
    </Slate>
  );
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

export default SlateNews;
