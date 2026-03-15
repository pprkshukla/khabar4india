import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

export default function Header() {
  return (
    <header className="bg-[#2d2d2d] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white hover:text-white/95 sm:text-3xl"
            >
              Khabar for India
            </Link>
            <p className="mt-1 text-sm text-white/80">
              Hindu Dharma · History · Culture · Methodology
            </p>
          </div>
          <nav
            className="flex flex-wrap items-center gap-6 border-t border-white/20 pt-4 sm:border-0 sm:pt-0"
            aria-label="Main navigation"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-white/90 transition hover:text-[#e74c3c]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
