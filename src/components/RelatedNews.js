import Link from "next/link";

export default function RelatedNews({ articles }) {
  if (!articles?.length) return null;

  return (
    <section className="mt-12 border-t border-[#e0e0e0] pt-8">
      <h2 className="pressroom-section-title">Related News</h2>
      <ul className="space-y-3">
        {articles.map((item) => {
          const title = item.fields?.title || "Untitled";
          const slug = item.fields?.slug || "";
          if (!slug) return null;
          return (
            <li key={item.sys.id}>
              <Link
                href={`/blog/${slug}`}
                className="text-[#c0392b] hover:underline font-medium"
              >
                {title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
