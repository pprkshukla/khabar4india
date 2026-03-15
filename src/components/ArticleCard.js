import Link from "next/link";
import Image from "next/image";

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

export default function ArticleCard({ article, variant = "default" }) {
  const title = article?.fields?.title || "Untitled";
  const slug = article?.fields?.slug || "";
  const excerpt = article?.fields?.excerpt || "";
  const publishedDate = article?.fields?.publishedDate || "";
  const category = article?.fields?.category?.fields?.name || "";
  const categorySlug = article?.fields?.category?.fields?.slug || "";
  const featuredImage = article?.fields?.featuredImage;
  const imageUrl = featuredImage ? getImageUrl(featuredImage) : null;

  const isCompact = variant === "compact";

  return (
    <article
      className={`group ${isCompact ? "flex gap-4" : "flex flex-col overflow-hidden rounded-lg border border-amber-200/40 bg-white shadow-sm transition hover:shadow-md"}`}
    >
      {imageUrl && !isCompact && (
        <Link href={`/blog/${slug}`} className="block aspect-[16/10] overflow-hidden bg-stone-100">
          <Image
            src={imageUrl}
            alt={title}
            width={600}
            height={375}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </Link>
      )}
      <div className={isCompact ? "min-w-0 flex-1" : "flex flex-1 flex-col p-4"}>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          {category && (
            <>
              <span>·</span>
              <Link
                href={`/blog?category=${categorySlug}`}
                className="font-medium uppercase tracking-wide text-amber-700 hover:underline"
              >
                {category}
              </Link>
            </>
          )}
        </div>
        <h2 className={`font-semibold text-stone-900 group-hover:text-amber-800 ${isCompact ? "mt-1 line-clamp-2 text-base" : "mt-2 line-clamp-2 text-lg"}`}>
          <Link href={`/blog/${slug}`}>{title}</Link>
        </h2>
        {excerpt && !isCompact && (
          <p className="mt-2 line-clamp-2 text-sm text-stone-600">{excerpt}</p>
        )}
      </div>
    </article>
  );
}
