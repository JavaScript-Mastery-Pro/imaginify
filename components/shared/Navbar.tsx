"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "../ui/button";
import { MobileNav } from "./MobileNav";
import { headerLinks } from "@/constants";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white shadow-lg shadow-purple-100">
      <div className="wrapper flex-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 py-4">
          <Image
            src="/assets/images/logo-text.svg"
            alt="logo"
            width={152}
            height={23}
          />
        </Link>

        {/* Nav Items */}
        <nav className="flex-between min-h-20 gap-3 md:gap-8">
          <SignedIn>
            <ul className="md:flex-between hidden w-full flex-col items-start gap-8 md:flex-row">
              {headerLinks.map((link) => {
                const isActive = link.route === pathname;
                const isActiveFeature = pathname.startsWith(
                  "/transformations/add/"
                );

                return (
                  <li
                    key={link.route}
                    className={`${
                      isActive && "gradient-text"
                    } flex-center p-16-medium whitespace-nowrap text-dark-700`}
                  >
                    {link.nested ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className={`${
                            isActiveFeature && "gradient-text"
                          } flex items-center gap-2 py-5 capitalize`}
                        >
                          AI Features
                          <Image
                            src="/assets/icons/caret-down.svg"
                            alt="caret down"
                            width={20}
                            height={20}
                          />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="dropdown-content">
                          {link.nested.map((item) => (
                            <DropdownMenuItem
                              asChild
                              key={item.route}
                              className="dropdown-item group flex items-center gap-3"
                            >
                              <Link href={item.route}>
                                <Image
                                  src={item.icon}
                                  alt={item.label}
                                  width={20}
                                  height={20}
                                  className="group-hover:brightness-200"
                                />
                                {item.label}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <Link className="p-16-semibold py-5" href={link.route}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            <UserButton afterSignOutUrl="/" />
            <MobileNav />
          </SignedIn>

          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </header>
  );
};
