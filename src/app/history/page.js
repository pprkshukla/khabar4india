import Link from "next/link";

export const metadata = {
  title: "History | Khabar for India",
  description:
    "Historical perspectives on Hindu Dharma, culture, and the Indian tradition.",
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-[#2d2d2d]">History</h1>
      <p className="mt-4 text-[#666]">
        Explore the historical threads of Hindu religion, methodology, and
        culture. Content for this page can be managed in Contentful as a Page
        entry or authored here.
      </p>
      <div className="mt-8 rounded-lg border border-[#e0e0e0] bg-white p-6">
        <p className="text-sm text-[#666]">
          Add your history articles via the{" "}
          <Link href="/articles" className="text-[#c0392b] hover:underline">
            Articles
          </Link>{" "}
          sections or the blog.
        </p>
      </div>
    </div>
  );
}
