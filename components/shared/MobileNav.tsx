"use client";

import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/constants";

import { Button } from "../ui/button";

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="header">
      {/* LOGO */}
      <Link href="/" className="flex items-center gap-2 md:py-2">
        <Image
          src="/assets/images/logo-text.svg"
          alt="logo"
          width={180}
          height={28}
        />
      </Link>

      {/* MENU ICON AS SHEET TRIGGER */}
      <nav className="flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />

          <Sheet>
            <SheetTrigger>
              <Image
                src="/assets/icons/menu.svg"
                alt="menu"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-64">
              <>
                <Image
                  src="/assets/images/logo-text.svg"
                  alt="logo"
                  width={152}
                  height={23}
                />

                <ul className="header-nav_elements">
                  {navLinks.map((link) => {
                    const isActive = link.route === pathname;

                    return (
                      <li
                        key={link.route}
                        className={`${
                          isActive && "gradient-text"
                        } p-18-semibold flex whitespace-nowrap text-dark-700`}
                      >
                        <Link href={link.route}>{link.label}</Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>

        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href="/sign-in">Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};
