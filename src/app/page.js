import Link from "next/link";
import {
  getHomePageData,
  isContentfulConfigured,
} from "@/lib/contentful";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 60;

export default async function HomePage() {
  const contentfulReady = isContentfulConfigured();
  const { featuredArticles, latestArticles, categories } =
    await getHomePageData();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {featuredArticles?.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content - two columns */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured grid - magazine style */}
            <section>
              <h2 className="pressroom-section-title">Featured</h2>
              <div className="grid gap-6 sm:grid-cols-2">
                {featuredArticles.slice(0, 4).map((article) => (
                  <ArticleCard key={article.sys.id} article={article} />
                ))}
              </div>
            </section>

            {/* More featured in a row */}
            <section>
              <h2 className="pressroom-section-title">Latest From Topics</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredArticles.slice(4, 8).map((article) => (
                  <ArticleCard
                    key={article.sys.id}
                    article={article}
                    variant="compact"
                  />
                ))}
              </div>
              <div className="mt-6 text-center sm:text-left">
                <Link
                  href="/blog"
                  className="inline-block rounded bg-[#c0392b] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#a93226]"
                >
                  View all articles
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar - Pressroom style */}
          <aside className="space-y-8">
            <section className="bg-white border border-[#e0e0e0] p-5">
              <h2 className="pressroom-section-title">Latest Posts</h2>
              <div className="space-y-0">
                {latestArticles.slice(0, 8).map((article) => (
                  <ArticleCard
                    key={article.sys.id}
                    article={article}
                    variant="list"
                  />
                ))}
              </div>
              <Link
                href="/blog"
                className="mt-4 inline-block text-sm font-medium text-[#c0392b] hover:underline"
              >
                Show more →
              </Link>
            </section>

            {categories?.length > 0 && (
              <section className="bg-white border border-[#e0e0e0] p-5">
                <h2 className="pressroom-section-title">Topics</h2>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.sys.id}
                      href={`/blog?category=${cat.fields?.slug || ""}`}
                      className="rounded bg-[#f0f0f0] px-3 py-1.5 text-sm font-medium text-[#2d2d2d] transition hover:bg-[#c0392b] hover:text-white"
                    >
                      {cat.fields?.name}
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      ) : (
        <div className="rounded-lg border border-[#e0e0e0] bg-white p-10 text-center">
          <h2 className="text-xl font-semibold text-[#2d2d2d]">
            Welcome to Khabar for India
          </h2>
          {!contentfulReady ? (
            <>
              <p className="mt-4 text-[#666]">
                Articles are loaded at <strong>build time</strong> from Contentful. This deploy
                does not have Delivery API credentials, so nothing could be fetched.
              </p>
              <p className="mt-3 text-left text-sm text-[#666] sm:text-center">
                In Netlify (or your host), add{" "}
                <code className="rounded bg-[#f0f0f0] px-1.5 py-0.5">
                  CONTENTFUL_SPACE_ID
                </code>{" "}
                and{" "}
                <code className="rounded bg-[#f0f0f0] px-1.5 py-0.5">
                  CONTENTFUL_ACCESS_TOKEN
                </code>{" "}
                (Content delivery / preview token, not the management token), trigger a new
                build, then deploy the new output. `.env.local` is not uploaded to Netlify.
              </p>
            </>
          ) : (
            <>
              <p className="mt-4 text-[#666]">
                No articles were returned. Publish at least one <strong>article</strong> entry in
                Contentful (content type id <code className="rounded bg-[#f0f0f0] px-1">article</code>
                ), then rebuild and redeploy. If entries exist, check the Delivery token has
                access to this space and inspect build logs for Contentful errors (for example{" "}
                <code className="rounded bg-[#f0f0f0] px-1">403</code>).
              </p>
            </>
          )}
          <p className="mt-4 text-sm text-[#888]">
            See <code className="rounded bg-[#f0f0f0] px-1.5 py-0.5">CONTENTFUL_SETUP.md</code> for
            setup instructions.
          </p>
        </div>
      )}
    </div>
  );
}
