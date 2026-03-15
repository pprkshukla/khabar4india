import Link from "next/link";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-amber-200/40 bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-semibold text-amber-900">Khabar for India</h3>
            <p className="mt-2 text-sm text-stone-600">
              Exploring the rich heritage of Hindu religion, methodology, and
              culture through history and tradition.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">Quick Links</h3>
            <ul className="mt-2 space-y-2">
              {footerLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-stone-600 hover:text-amber-800"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">Topics</h3>
            <p className="mt-2 text-sm text-stone-600">
              Scriptures · Philosophy · Festivals · Temples · Traditions
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-amber-900">Get In Touch</h3>
            <p className="mt-2 text-sm text-stone-600">
              Have questions or suggestions?{" "}
              <Link href="/contact" className="text-amber-700 hover:underline">
                Contact us
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-amber-200/40 pt-6 text-center text-sm text-stone-500">
          © {currentYear} Khabar for India. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
