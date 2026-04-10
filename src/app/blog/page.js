import { Suspense } from "react";
import { getArticles, getCategories } from "@/lib/contentful";
import BlogListing from "@/components/BlogListing";

export const revalidate = 60;

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    getArticles({ limit: 200 }),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="mb-8 h-10 max-w-md animate-pulse rounded bg-[#eee]" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded border border-[#e0e0e0] bg-[#f5f5f5]"
              />
            ))}
          </div>
        </div>
      }
    >
      <BlogListing articles={articles} categories={categories} />
    </Suspense>
  );
}
