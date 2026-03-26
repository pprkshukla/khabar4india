import Link from "next/link";
import { notFound } from "next/navigation";
import {
  isNavSection,
  getSectionChildren,
  MAIN_NAV,
} from "@/data/navigation";

const titles = Object.fromEntries(
  MAIN_NAV.filter((n) => n.section).map((n) => [n.section, n.label])
);

export function generateStaticParams() {
  return MAIN_NAV.filter((n) => n.section).map((n) => ({
    section: n.section,
  }));
}

export default function SectionIndexPage({ params }) {
  const section = params?.section;
  if (!section || !isNavSection(section)) notFound();

  const children = getSectionChildren(section);
  const title = titles[section] || section;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-[#2d2d2d]">{title}</h1>
      <p className="mt-2 text-[#666]">
        चुनें / Select a topic below.
      </p>
      <ul className="mt-8 space-y-2">
        {children.map((child) => (
          <li key={child.slug}>
            <Link
              href={`/${section}/${child.slug}`}
              className="block rounded border border-[#e0e0e0] bg-white px-4 py-3 text-[#c0392b] transition hover:border-[#c0392b] hover:bg-amber-50/50"
            >
              {child.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
