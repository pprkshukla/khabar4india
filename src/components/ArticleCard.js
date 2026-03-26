import Link from "next/link";
import Image from "next/image";
import { richTextToPlainText } from "@/lib/richTextPlainText";

function getImageUrl(asset) {
  if (!asset?.fields?.file?.url) return null;
  const url = asset.fields.file.url;
  return url.startsWith("//") ? `https:${url}` : url;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Preview text for cards: rich Summary → plain text, or legacy Excerpt. */
function getCardPreview(article) {
  const summary = article?.fields?.summary;
  if (summary) {
    const plain = richTextToPlainText(summary);
    if (plain) return plain;
  }
  return article?.fields?.excerpt || "";
}

function getCardImage(article) {
  const asset = article?.fields?.featureImage || article?.fields?.featuredImage;
  return asset ? getImageUrl(asset) : null;
}

export default function ArticleCard({ article, variant = "default" }) {
  const title = article?.fields?.title || "Untitled";
  const slug = article?.fields?.slug || "";
  const preview = getCardPreview(article);
  const publishedDate = article?.fields?.publishedDate || "";
  const category = article?.fields?.category?.fields?.name || "";
  const categorySlug = article?.fields?.category?.fields?.slug || "";
  const author = article?.fields?.author?.fields?.name;
  const imageUrl = getCardImage(article);

  const isCompact = variant === "compact";
  const isList = variant === "list";

  if (isList) {
    return (
      <article className="group border-b border-[#e0e0e0] py-4 first:pt-0 last:border-b-0">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-[#666]">
          <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          {category && (
            <>
              <span>·</span>
              <Link
                href={`/blog?category=${categorySlug}`}
                className="font-medium uppercase tracking-wide text-[#c0392b] hover:underline"
              >
                {category}
              </Link>
            </>
          )}
        </div>
        <h2 className="mt-1 font-semibold text-[#2d2d2d] group-hover:text-[#c0392b] line-clamp-2">
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        {preview && (
          <p className="mt-1 line-clamp-2 text-sm text-[#666]">{preview}</p>
        )}
      </article>
    );
  }

  return (
    <article
      className={`group bg-white ${isCompact ? "flex gap-4" : "flex flex-col overflow-hidden border border-[#e0e0e0] shadow-sm"} transition hover:shadow-md`}
    >
      {imageUrl && !isCompact && (
        <Link
          href={`/blog/${slug}`}
          className="block aspect-[16/10] overflow-hidden bg-[#eee]"
        >
          <Image
            src={imageUrl}
            alt={title}
            width={600}
            height={375}
            className="h-full w-full object-cover transition group-hover:opacity-95"
          />
        </Link>
      )}
      <div className={isCompact ? "min-w-0 flex-1" : "flex flex-1 flex-col p-4"}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0 text-xs text-[#666]">
          <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          {category && (
            <>
              <span>·</span>
              <Link
                href={`/blog?category=${categorySlug}`}
                className="font-medium uppercase tracking-wide text-[#c0392b] hover:underline"
              >
                {category}
              </Link>
            </>
          )}
          {author && (
            <>
              <span>·</span>
              <span>By {author}</span>
            </>
          )}
        </div>
        <h2
          className={`font-semibold text-[#2d2d2d] group-hover:text-[#c0392b] ${isCompact ? "mt-1 line-clamp-2 text-base" : "mt-2 line-clamp-2 text-lg"}`}
        >
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        {preview && !isCompact && (
          <p className="mt-2 line-clamp-2 text-sm text-[#666]">{preview}</p>
        )}
      </div>
    </article>
  );
}
