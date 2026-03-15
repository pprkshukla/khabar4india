import { getArticles, getArticlesByCategory, getCategories } from "@/lib/contentful";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";

export const revalidate = 60;

export default async function BlogPage({ searchParams }) {
  const categorySlug = searchParams?.category || null;
  const categories = await getCategories();

  let articles;
  if (categorySlug && categories?.length) {
    const category = categories.find(
      (c) => (c.fields?.slug || "").toLowerCase() === categorySlug.toLowerCase()
    );
    if (category) {
      articles = await getArticlesByCategory(category.sys.id, 50);
    } else {
      articles = await getArticles({ limit: 50 });
    }
  } else {
    articles = await getArticles({ limit: 50 });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-amber-900">Blog & Articles</h1>
      <p className="mb-8 text-stone-600">
        Explore articles on Hindu religion, history, and culture.
      </p>

      {categories?.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              !categorySlug
                ? "bg-amber-600 text-white"
                : "bg-amber-100 text-amber-800 hover:bg-amber-200"
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.sys.id}
              href={`/blog?category=${cat.fields?.slug || ""}`}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                categorySlug === (cat.fields?.slug || "")
                  ? "bg-amber-600 text-white"
                  : "bg-amber-100 text-amber-800 hover:bg-amber-200"
              }`}
            >
              {cat.fields?.name}
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
        <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-8 text-center">
          <p className="text-stone-600">No articles found.</p>
          {categorySlug && (
            <Link href="/blog" className="mt-2 inline-block text-amber-700 hover:underline">
              View all articles
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
