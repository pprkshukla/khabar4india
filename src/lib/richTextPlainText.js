import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";

/**
 * Plain text from a Contentful Rich Text document (for cards, meta description fallback).
 */
export function richTextToPlainText(doc) {
  if (!doc) return "";
  try {
    return documentToPlainTextString(doc).trim();
  } catch {
    return "";
  }
}
