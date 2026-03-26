import Image from "next/image";
import Link from "next/link";
import MainNav from "@/components/MainNav";

export default function Header() {
  return (
    <header className="bg-[#2d2d2d] text-white">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center transition opacity-90 hover:opacity-100"
        >
          <Image
            src="/logoK4I.png"
            alt="Khabar for India"
            width={640}
            height={120}
            className="h-24 w-auto sm:h-24 md:h-45"
            priority
          />
        </Link>
        <p className="mt-2 text-sm text-white/80">
          Hindu Dharma · History · Culture · Methodology
        </p>
        <div className="mt-4 border-t border-white/15 pt-3">
          <MainNav />
        </div>
      </div>
    </header>
  );
}
