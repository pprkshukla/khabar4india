import { getPageBySlug } from "@/lib/contentful";
import RichText from "@/components/RichText";

export const revalidate = 60;

const SITE_NAME = "Khabar for India";

export async function generateMetadata() {
  const page = await getPageBySlug("contact-us");
  const title = page?.fields?.metaTitle || page?.fields?.title || "Contact Us";
  const description =
    page?.fields?.metaDescription || "Get in touch with Khabar for India.";
  return {
    title: `${title} | ${SITE_NAME}`,
    description: description.slice(0, 160),
  };
}

export default async function ContactPage() {
  const page = await getPageBySlug("contact-us");

  if (!page?.fields?.body) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-6 text-3xl font-bold text-[#2d2d2d]">Contact Us</h1>
        <div className="rounded-lg border border-[#e0e0e0] bg-white p-8">
          <p className="text-[#666]">
            This page is managed in Contentful. Create a &quot;Page&quot; entry
            with slug <code className="rounded bg-[#f0f0f0] px-1.5 py-0.5">contact-us</code>{" "}
            and add your contact details and message. See CONTENTFUL_SETUP.md for
            details.
          </p>
        </div>
      </div>
    );
  }

  const title = page.fields?.title || "Contact Us";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-[#2d2d2d]">{title}</h1>
      <div className="rounded-lg border border-[#e0e0e0] bg-white p-6 sm:p-8">
        <RichText content={page.fields.body} />
      </div>
    </div>
  );
}
