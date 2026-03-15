import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  return (
    <header className="border-b border-amber-200/40 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-amber-800 hover:text-amber-900 sm:text-2xl"
          >
            Khabar for India
          </Link>
          <nav className="flex items-center gap-6" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-stone-600 transition hover:text-amber-800"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-1 text-xs text-stone-500 sm:text-sm">
          Hindu Dharma · History · Culture · Methodology
        </p>
      </div>
    </header>
  );
}
