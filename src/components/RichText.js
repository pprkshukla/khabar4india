"use client";

import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mb-4 text-[#333] leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="mb-3 mt-6 text-xl font-semibold text-[#2d2d2d]">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="mb-2 mt-4 text-lg font-semibold text-[#2d2d2d]">
        {children}
      </h3>
    ),
    [BLOCKS.UL_LIST]: (node, children) => (
      <ul className="mb-4 list-disc pl-6 space-y-1 text-[#333]">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="mb-4 list-decimal pl-6 space-y-1 text-[#333]">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => <li>{children}</li>,
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="border-l-4 border-[#c0392b] pl-4 my-4 italic text-[#666]">
        {children}
      </blockquote>
    ),
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#c0392b] underline hover:text-[#a93226]"
      >
        {children}
      </a>
    ),
  },
};

export default function RichText({ content }) {
  if (!content) return null;
  return (
    <div className="prose-custom max-w-none">
      {documentToReactComponents(content, options)}
    </div>
  );
}
