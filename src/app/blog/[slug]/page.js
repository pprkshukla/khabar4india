import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticleBySlug, getArticles } from "@/lib/contentful";
import RichText from "@/components/RichText";
import RelatedNews from "@/components/RelatedNews";
import { richTextToPlainText } from "@/lib/richTextPlainText";

export const revalidate = 60;

const SITE_NAME = "Khabar for India";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://khabar4india.com";

function getImageUrl(asset) {
  if (!asset?.fields?.file?.url) return null;
  const url = asset.fields.file.url;
  return url.startsWith("//") ? `https:${url}` : url;
}

/** Display publish date without time (date-only in UI). */
function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getFeatureImage(article) {
  const asset = article?.fields?.featureImage || article?.fields?.featuredImage;
  return asset ? getImageUrl(asset) : null;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  if (!slug) return { title: "Article | " + SITE_NAME };
  const { article } = await getArticleBySlug(slug);
  if (!article) return { title: "Article | " + SITE_NAME };
  const title =
    article.fields?.metaTitle || article.fields?.title || "Untitled";
  const description =
    article.fields?.metaDescription ||
    richTextToPlainText(article.fields?.summary) ||
    article.fields?.excerpt ||
    "";
  const imageUrl = getFeatureImage(article);
  const url = `${SITE_URL}/blog/${slug}`;
  const finalDescription = description.slice(0, 160);

  return {
    title: `${title} | ${SITE_NAME}`,
    description: finalDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description: finalDescription,
      siteName: SITE_NAME,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title,
      description: finalDescription,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticles({ limit: 100 });
  return (articles || []).map((a) => ({
    slug: a.fields?.slug || a.sys.id,
  }));
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  if (!slug) notFound();

  const { article, relatedArticles } = await getArticleBySlug(slug);
  if (!article) notFound();

  const title = article.fields?.title || "Untitled";
  const body = article.fields?.body;
  const summary = article.fields?.summary;
  const publishedDate = article.fields?.publishedDate || "";
  const category = article.fields?.category?.fields;
  const author = article.fields?.author?.fields;
  const imageUrl = getFeatureImage(article);

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link
        href="/blog"
        className="mb-6 inline-block text-sm font-medium text-[#c0392b] hover:underline"
      >
        ← Back to Blog
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-[#666]">
          <time dateTime={publishedDate}>
            {formatDate(publishedDate)}
          </time>
          {category?.name && (
            <>
              <span>·</span>
              <Link
                href={`/blog?category=${category.slug || ""}`}
                className="font-medium uppercase tracking-wide text-[#c0392b] hover:underline"
              >
                {category.name}
              </Link>
            </>
          )}
          {author?.name && (
            <>
              <span>·</span>
              <span>By {author.name}</span>
            </>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-bold text-[#2d2d2d] sm:text-4xl">
          {title}
        </h1>
      </header>

      {imageUrl && (
        <div className="relative mb-8 aspect-video overflow-hidden border border-[#e0e0e0] bg-[#eee]">
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

      {summary && (
        <div className="mb-8 rounded-lg border border-[#e0e0e0] bg-white p-5 prose-custom">
          <RichText content={summary} />
        </div>
      )}

      <div className="prose-custom">
        {body ? <RichText content={body} /> : null}
      </div>

      <RelatedNews articles={relatedArticles} />

      {author && (
        <footer className="mt-10 border-t border-[#e0e0e0] pt-6">
          <div className="flex items-start gap-4">
            {author.avatar?.fields?.file?.url && (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#e0e0e0]">
                <Image
                  src={
                    author.avatar.fields.file.url.startsWith("//")
                      ? `https:${author.avatar.fields.file.url}`
                      : author.avatar.fields.file.url
                  }
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            )}
            <div>
              <p className="font-semibold text-[#2d2d2d]">{author.name}</p>
              {author.role && (
                <p className="text-sm text-[#c0392b]">{author.role}</p>
              )}
              {author.bio && (
                <div className="mt-2 text-sm text-[#666] prose-custom">
                  {typeof author.bio === "string" ? (
                    <p>{author.bio}</p>
                  ) : (
                    <RichText content={author.bio} />
                  )}
                </div>
              )}
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}
