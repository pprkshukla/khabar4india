import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isNavSection,
  getSectionChildren,
  getTopicLabel,
  getAllSectionSlugParams,
  MAIN_NAV,
} from "@/data/navigation";

export const revalidate = 3600;

export function generateStaticParams() {
  return getAllSectionSlugParams();
}

export default async function TopicPage({ params }) {
  const { section, slug } = await params;
  if (!section || !slug || !isNavSection(section)) notFound();

  const children = getSectionChildren(section);
  const valid = children.some((c) => c.slug === slug);
  if (!valid) notFound();

  const topicTitle = getTopicLabel(section, slug);
  const parentLabel =
    MAIN_NAV.find((n) => n.section === section)?.label || section;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/${section}`}
        className="text-sm font-medium text-[#c0392b] hover:underline"
      >
        ← {parentLabel}
      </Link>
      <h1 className="mt-6 text-2xl font-bold leading-snug text-[#2d2d2d] sm:text-3xl">
        {topicTitle}
      </h1>
      <div className="mt-8 rounded-lg border border-[#e0e0e0] bg-white p-6 text-[#666]">
        <p>
          यह खंड सामग्री के लिए तैयार किया गया है। आप इस पृष्ठ पर Contentful
          या स्थिर प्रतिलिपि जोड़ सकते हैं।
        </p>
        <p className="mt-3 text-sm">
          This section is ready for your content. Connect it to Contentful or
          add copy here when you are ready.
        </p>
      </div>
    </div>
  );
}
