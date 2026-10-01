"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFoodCategories } from "@/app/_api/api";
import { Logo } from "./logo";

const COMPANY_LINKS = [
  { label: "Home", href: "/" },
  { label: "Contact us", href: "#" },
  { label: "Delivery zone", href: "#" },
];

const LEGAL_LINKS = ["Privacy policy", "Terms and conditions", "Cookie policy"];

const linkClass = "text-base text-white transition-colors hover:text-red-400";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95h-1.51c-1.49 0-1.95.93-1.95 1.87V12h3.33l-.53 3.47h-2.8v8.38A12 12 0 0 0 24 12Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="size-6"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function FooterColumn({ title, className = "", children }) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <p className="text-sm text-zinc-500">{title}</p>
      {children}
    </div>
  );
}

export function Footer() {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    fetchFoodCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <footer className="bg-zinc-900 pt-15 pb-12">
      <div className="overflow-hidden bg-red-500 py-7">
        <div className="flex gap-8 text-3xl font-semibold whitespace-nowrap text-white">
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i}>Fresh fast delivered</span>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-324 px-4">
        <div className="flex flex-col gap-10 pt-19 lg:flex-row lg:gap-0">
          <div className="lg:w-78.5">
            <div className="inline-block">
              <Logo stacked />
            </div>
          </div>

          <FooterColumn title="NOMNOM" className="lg:w-59">
            {COMPANY_LINKS.map(({ label, href }) => (
              <Link key={label} href={href} className={linkClass}>
                {label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title="MENU" className="lg:w-109">
            <div className="grid auto-cols-[190px] grid-flow-col grid-rows-5 gap-y-4">
              {categories === null
                ? Array.from({ length: 5 }, (_, i) => (
                    <div
                      key={i}
                      className="h-6 w-28 animate-pulse rounded bg-zinc-700"
                    />
                  ))
                : categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/#${category._id}`}
                      className={linkClass}
                    >
                      {category.categoryName}
                    </Link>
                  ))}
            </div>
          </FooterColumn>

          <FooterColumn title="FOLLOW US">
            <div className="flex gap-4 text-white">
              <a href="#" aria-label="Facebook" className="hover:text-red-400">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-red-400">
                <InstagramIcon />
              </a>
            </div>
          </FooterColumn>
        </div>

        <div className="mt-26 flex flex-wrap gap-x-12 gap-y-2 border-t border-zinc-700 pt-8 text-sm text-zinc-500">
          <span>Copy right 2024 © Nomnom LLC</span>
          {LEGAL_LINKS.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
