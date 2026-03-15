import Link from "next/link";
import { getArticles } from "@/lib/contentful";

const footerNav = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact Us" },
];

export default async function Footer() {
  const latestArticles = await getArticles({ limit: 5 });
  const currentYear = new Date().getFullYear();

  function formatDate(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <footer className="bg-[#2d2d2d] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-white border-b-2 border-white/30 pb-2 mb-4">
              About Khabar for India
            </h3>
            <p className="text-sm leading-relaxed text-white/80">
              Exploring the rich heritage of Hindu religion, methodology, and
              culture through history and tradition.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-white border-b-2 border-white/30 pb-2 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerNav.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/80 transition hover:text-[#e74c3c]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-white border-b-2 border-white/30 pb-2 mb-4">
              Latest Posts
            </h3>
            {latestArticles?.length > 0 ? (
              <ul className="space-y-2">
                {latestArticles.map((article) => (
                  <li key={article.sys.id}>
                    <Link
                      href={`/blog/${article.fields?.slug || ""}`}
                      className="text-sm text-white/80 transition hover:text-[#e74c3c] line-clamp-2"
                    >
                      {article.fields?.title || "Untitled"}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/60">No posts yet.</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold uppercase tracking-wide text-white border-b-2 border-white/30 pb-2 mb-4">
              Get In Touch
            </h3>
            <p className="text-sm text-white/80">
              Have questions or suggestions?{" "}
              <Link
                href="/contact"
                className="text-[#e74c3c] hover:underline"
              >
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/20 pt-6 sm:flex-row">
          <p className="text-sm text-white/60">
            © {currentYear} Khabar for India. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/80">
            <Link href="/about" className="hover:text-[#e74c3c]">
              About
            </Link>
            <Link href="/blog" className="hover:text-[#e74c3c]">
              Blog
            </Link>
            <Link href="/contact" className="hover:text-[#e74c3c]">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
