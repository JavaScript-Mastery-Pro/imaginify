"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";

import { Button } from "../ui/button";
import { navLinks } from "@/constants";

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-72 bg-white p-5 shadow-md shadow-purple-200/50 md:flex">
      <div className="flex h-full w-full flex-col gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 md:py-2">
          <Image
            src="/assets/images/logo-text.svg"
            alt="logo"
            width={180}
            height={28}
          />
        </Link>

        {/* Nav Items */}
        <nav className="h-full flex-col justify-between md:flex md:gap-4">
          <SignedIn>
            <ul className="hidden w-full flex-col items-start gap-2 md:flex">
              {navLinks.slice(0, 5).map((link) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={link.route}
                    className={`${
                      isActive && "bg-purple-gradient text-white"
                    } flex-center p-16-semibold group w-full whitespace-nowrap rounded-full bg-cover text-dark-700 transition-all hover:bg-purple-100 hover:shadow-inner `}
                  >
                    <Link
                      className="p-16-semibold flex h-full w-full gap-4 p-4"
                      href={link.route}
                    >
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <ul className="hidden w-full flex-col items-start gap-2 md:flex">
              {navLinks.slice(5).map((link) => {
                const isActive = link.route === pathname;

                return (
                  <li
                    key={link.route}
                    className={`${
                      isActive && "bg-purple-gradient text-white"
                    } flex-center p-16-semibold group w-full whitespace-nowrap rounded-full bg-cover text-dark-700 transition-all hover:bg-purple-100 hover:shadow-inner `}
                  >
                    <Link
                      className="p-16-semibold flex h-full w-full gap-4 p-4"
                      href={link.route}
                    >
                      <Image
                        src={link.icon}
                        alt="logo"
                        width={24}
                        height={24}
                        className={`${isActive && "brightness-200"}`}
                      />
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li className="flex-center cursor-pointer gap-2 p-4">
                <UserButton afterSignOutUrl="/" showName />
              </li>
            </ul>
          </SignedIn>

          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};
