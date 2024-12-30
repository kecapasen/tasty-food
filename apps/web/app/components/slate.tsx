import { GetNewsDTO } from "@repo/dto";
import React, { ReactNode, useMemo } from "react";
import {
  BaseEditor,
  createEditor,
  Editor,
  Transforms,
  Element,
  Descendant,
} from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import {
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  useSlate,
  withReact,
} from "slate-react";
import { Toggle } from "./ui/toggle";
import { Prisma } from "@repo/db";

export type BlockFormat =
  | "heading-one"
  | "heading-two"
  | "bulleted-list"
  | "numbered-list"
  | "list-item"
  | "blockquote"
  | "paragraph";
export type MarkFormat = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};
export type ActiveMark = Record<keyof MarkFormat, boolean>;
type CustomElement = {
  type: BlockFormat;
  children: CustomText[];
};
export type CustomText = MarkFormat & {
  text: string;
};
declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export const LIST_TYPES = ["numbered-list", "bulleted-list"];

const SlateNews = ({
  content,
  children,
  onChange,
}: {
  content: Prisma.JsonValue;
  children: ReactNode;
  onChange?: ((value: Descendant[]) => void) | undefined;
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return (
    <Slate
      editor={editor}
      initialValue={JSON.parse(content!.toString())}
      onChange={onChange}
    >
      {children}
    </Slate>
  );
};

export const toggleBlock = (editor: Editor, format: BlockFormat) => {
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
export const toggleMark = (editor: Editor, format: keyof MarkFormat) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};
export const isBlockActive = (editor: Editor, format: BlockFormat) => {
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
export const isMarkActive = (editor: Editor, format: keyof MarkFormat) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
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
export const BlockButton = (props: {
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
export const MarkButton = (props: {
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

export default SlateNews;
