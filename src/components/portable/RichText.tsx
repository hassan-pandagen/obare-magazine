import { PortableText, PortableTextComponents } from "@portabletext/react";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <span className="block">{children}</span>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    highlight: ({ value, children }) => (
      <span style={{ color: value?.color ?? "#e60303" }}>{children}</span>
    ),
  },
};

interface RichTextProps {
  value: unknown[];
  className?: string;
}

export default function RichText({ value, className }: RichTextProps) {
  if (!value?.length) return null;
  return (
    <span className={className}>
      <PortableText value={value as Parameters<typeof PortableText>[0]["value"]} components={components} />
    </span>
  );
}
