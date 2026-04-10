"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";

function categorySlugFromArticle(article) {
  return article?.fields?.category?.fields?.slug || "";
}

function tagsFromArticle(article) {
  const tags = article?.fields?.tags;
  if (!Array.isArray(tags)) return [];
  return tags
    .map((t) => String(t || "").trim())
    .filter(Boolean);
}

export default function BlogListing({ articles: initialArticles, categories }) {
  const searchParams = useSearchParams();
  const categorySlug = useMemo(() => {
    const raw = searchParams.get("category");
    if (raw == null) return null;
    const t = raw.trim();
    return t || null;
  }, [searchParams]);
  const tag = useMemo(() => {
    const raw = searchParams.get("tag");
    if (raw == null) return null;
    const t = raw.trim();
    return t || null;
  }, [searchParams]);

  const allTags = useMemo(() => {
    const map = new Map();
    (initialArticles || []).forEach((article) => {
      tagsFromArticle(article).forEach((t) => {
        const key = t.toLowerCase();
        if (!map.has(key)) map.set(key, t);
      });
    });
    return [...map.values()].sort((a, b) => a.localeCompare(b));
  }, [initialArticles]);

  const articles = useMemo(() => {
    return (initialArticles || []).filter((a) => {
      const categoryMatch = categorySlug
        ? categorySlugFromArticle(a).toLowerCase() === categorySlug.toLowerCase()
        : true;
      const tagMatch = tag
        ? tagsFromArticle(a).some((t) => t.toLowerCase() === tag.toLowerCase())
        : true;
      return categoryMatch && tagMatch;
    });
  }, [initialArticles, categorySlug, tag]);

  const categoryHref = (slug) =>
    slug
      ? `/blog?category=${encodeURIComponent(slug)}${tag ? `&tag=${encodeURIComponent(tag)}` : ""}`
      : `/blog${tag ? `?tag=${encodeURIComponent(tag)}` : ""}`;

  const tagHref = (nextTag) =>
    nextTag
      ? `/blog?tag=${encodeURIComponent(nextTag)}${categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : ""}`
      : `/blog${categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : ""}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2d2d2d]">Blog & Articles</h1>
        <p className="mt-2 text-[#666]">
          Explore articles on Hindu religion, history, and culture.
        </p>
      </div>

      {categories?.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href={categoryHref(null)}
            className={`rounded px-4 py-2 text-sm font-medium transition ${
              !categorySlug
                ? "bg-[#c0392b] text-white"
                : "bg-[#f0f0f0] text-[#2d2d2d] hover:bg-[#e0e0e0]"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.sys.id}
              href={categoryHref(cat.fields?.slug || "")}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                (cat.fields?.slug || "").toLowerCase() ===
                (categorySlug || "").toLowerCase()
                  ? "bg-[#c0392b] text-white"
                  : "bg-[#f0f0f0] text-[#2d2d2d] hover:bg-[#e0e0e0]"
              }`}
            >
              {cat.fields?.name}
            </Link>
          ))}
        </div>
      )}

      {allTags.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href={tagHref(null)}
            className={`rounded px-4 py-2 text-sm font-medium transition ${
              !tag
                ? "bg-[#2d2d2d] text-white"
                : "bg-[#f0f0f0] text-[#2d2d2d] hover:bg-[#e0e0e0]"
            }`}
          >
            All Tags
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={tagHref(t)}
              className={`rounded px-4 py-2 text-sm font-medium transition ${
                (tag || "").toLowerCase() === t.toLowerCase()
                  ? "bg-[#2d2d2d] text-white"
                  : "bg-[#f0f0f0] text-[#2d2d2d] hover:bg-[#e0e0e0]"
              }`}
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      {articles?.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.sys.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-[#e0e0e0] bg-white p-10 text-center">
          <p className="text-[#666]">No articles found.</p>
          {(categorySlug || tag) && (
            <Link
              href="/blog"
              className="mt-4 inline-block text-[#c0392b] hover:underline"
            >
              View all articles
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
