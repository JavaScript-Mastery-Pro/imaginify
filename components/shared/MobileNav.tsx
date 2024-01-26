"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { Button } from "../ui/button";

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <header className="flex-between fixed h-16 w-full border-b-4 border-purple-100 bg-white p-5 lg:hidden ">
      {/* LOGO */}
      <Image
        src="/assets/images/logo-text.svg"
        alt="logo"
        width={180}
        height={28}
      />

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

                <ul className="mt-8 flex w-full flex-col items-start gap-5">
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
