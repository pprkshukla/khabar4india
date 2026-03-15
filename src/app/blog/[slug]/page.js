import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/contentful";
import RichText from "@/components/RichText";

export const revalidate = 60;

function getImageUrl(asset) {
  if (!asset?.fields?.file?.url) return null;
  const url = asset.fields.file.url;
  return url.startsWith("//") ? `https:${url}` : url;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  const articles = await getArticles({ limit: 100 });
  return (articles || []).map((a) => ({ slug: a.fields?.slug || a.sys.id }));
}

export default async function ArticlePage({ params }) {
  const slug = params?.slug;
  if (!slug) notFound();

  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const title = article.fields?.title || "Untitled";
  const body = article.fields?.body;
  const excerpt = article.fields?.excerpt || "";
  const publishedDate = article.fields?.publishedDate || "";
  const category = article.fields?.category?.fields;
  const featuredImage = article.fields?.featuredImage;
  const imageUrl = featuredImage ? getImageUrl(featuredImage) : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/blog"
        className="mb-6 inline-block text-sm font-medium text-amber-700 hover:underline"
      >
        ← Back to Blog
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <time dateTime={publishedDate}>{formatDate(publishedDate)}</time>
          {category?.name && (
            <>
              <span>·</span>
              <Link
                href={`/blog?category=${category.slug || ""}`}
                className="font-medium uppercase tracking-wide text-amber-700 hover:underline"
              >
                {category.name}
              </Link>
            </>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold text-amber-900 sm:text-4xl">
          {title}
        </h1>
        {excerpt && (
          <p className="mt-4 text-lg text-stone-600">{excerpt}</p>
        )}
      </header>

      {imageUrl && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-stone-100">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
        </div>
      )}

      <div className="prose-custom">
        {body ? <RichText content={body} /> : null}
      </div>
    </article>
  );
}
