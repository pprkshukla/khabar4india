import Link from "next/link";
import { getHomePageData } from "@/lib/contentful";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 60;

export default async function HomePage() {
  const { featuredArticles, latestArticles, categories } =
    await getHomePageData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <section className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-amber-900 sm:text-4xl">
          Khabar for India
        </h1>
        <p className="mt-2 text-lg text-stone-600">
          Hindu Dharma · History · Culture · Methodology
        </p>
      </section>

      {featuredArticles?.length > 0 ? (
        <>
          <section className="mb-12">
            <h2 className="mb-6 text-xl font-semibold text-amber-900">
              Featured Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredArticles.slice(0, 6).map((article) => (
                <ArticleCard key={article.sys.id} article={article} />
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-amber-900">
                Latest Posts
              </h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-amber-700 hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {latestArticles.slice(0, 6).map((article) => (
                <ArticleCard
                  key={article.sys.id}
                  article={article}
                  variant="compact"
                />
              ))}
            </div>
          </section>

          {categories?.length > 0 && (
            <section className="mb-12">
              <h2 className="mb-4 text-xl font-semibold text-amber-900">
                Topics
              </h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.sys.id}
                    href={`/blog?category=${cat.fields?.slug || ""}`}
                    className="rounded-full bg-amber-100 px-4 py-2 text-sm font-medium text-amber-800 transition hover:bg-amber-200"
                  >
                    {cat.fields?.name}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-8 text-center">
          <p className="text-stone-600">
            No articles yet. Add content in Contentful to see it here.
          </p>
          <p className="mt-2 text-sm text-stone-500">
            See <code className="rounded bg-amber-100 px-1">CONTENTFUL_SETUP.md</code> for
            setup instructions.
          </p>
        </div>
      )}
    </div>
  );
}
