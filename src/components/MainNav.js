"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAIN_NAV } from "@/data/navigation";

export default function MainNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navRef = useRef(null);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
    setOpenDropdown(null);
  }, [pathname, closeMobile]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => e.key === "Escape" && closeMobile();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  return (
    <div className="w-full">
      <div className="mb-2 flex justify-end lg:hidden">
        <button
          type="button"
          className="flex items-center gap-2 rounded border border-white/30 px-3 py-2 text-sm text-white"
          aria-expanded={mobileOpen}
          aria-controls="main-nav-panel"
          onClick={() => setMobileOpen((o) => !o)}
        >
          Menu
          <span className="text-xs opacity-80" aria-hidden>
            {mobileOpen ? "▴" : "▾"}
          </span>
        </button>
      </div>

      {/* Desktop */}
      <nav
        className="hidden flex-wrap items-center gap-1 lg:flex lg:gap-0 xl:gap-1"
        aria-label="Main navigation"
      >
        {MAIN_NAV.map((item) => {
          if (!item.children) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-2 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-[#e74c3c] xl:px-3 ${
                  pathname === item.href ? "bg-white/10 text-[#e74c3c]" : "text-white/90"
                }`}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.section} className="group relative">
              <Link
                href={item.href}
                className={`flex items-center gap-1 rounded px-2 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-[#e74c3c] xl:px-3 ${
                  pathname.startsWith(item.href) && item.href !== "/"
                    ? "bg-white/10 text-[#e74c3c]"
                    : "text-white/90"
                }`}
              >
                {item.label}
                <span className="text-[10px] opacity-70" aria-hidden>
                  ▾
                </span>
              </Link>
              <div
                className="invisible absolute left-0 top-full z-50 min-w-[14rem] pt-1 opacity-0 transition group-hover:visible group-hover:opacity-100"
                role="menu"
              >
                <ul className="max-h-[70vh] overflow-y-auto rounded border border-[#444] bg-[#2d2d2d] py-2 shadow-lg">
                  {item.children.map((child) => (
                    <li key={child.slug} role="none">
                      <Link
                        role="menuitem"
                        href={`/${item.section}/${child.slug}`}
                        className="block px-4 py-2.5 text-sm text-white/90 transition hover:bg-[#e74c3c]/20 hover:text-[#e74c3c]"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Mobile panel */}
      <div
        id="main-nav-panel"
        ref={navRef}
        className={`lg:hidden ${mobileOpen ? "mt-4 border-t border-white/20 pt-4" : "hidden"}`}
      >
        <ul className="flex flex-col gap-1" role="list">
          {MAIN_NAV.map((item) => {
            if (!item.children) {
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`block rounded px-3 py-2.5 text-sm font-medium ${
                      pathname === item.href
                        ? "bg-white/15 text-[#e74c3c]"
                        : "text-white/90"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            }

            const open = openDropdown === item.section;
            return (
              <li key={item.section}>
                <div className="flex items-stretch rounded">
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={`flex flex-1 items-center px-3 py-2.5 text-sm font-medium ${
                      pathname.startsWith(item.href) && item.href !== "/"
                        ? "bg-white/15 text-[#e74c3c]"
                        : "text-white/90"
                    }`}
                  >
                    {item.label}
                  </Link>
                  <button
                    type="button"
                    className="border-l border-white/15 px-3 text-white/80"
                    aria-expanded={open}
                    aria-label={`${open ? "Collapse" : "Expand"} ${item.label} submenu`}
                    onClick={() =>
                      setOpenDropdown(open ? null : item.section)
                    }
                  >
                    <span className="text-xs" aria-hidden>
                      {open ? "▴" : "▾"}
                    </span>
                  </button>
                </div>
                {open && (
                  <ul className="ml-2 border-l border-white/20 py-1 pl-3">
                    {item.children.map((child) => (
                      <li key={child.slug}>
                        <Link
                          href={`/${item.section}/${child.slug}`}
                          onClick={closeMobile}
                          className="block py-2 text-sm text-white/85 hover:text-[#e74c3c]"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
