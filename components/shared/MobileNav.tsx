"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { headerLinks } from "@/constants";

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex-center md:hidden ">
      <Sheet>
        <SheetTrigger>
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={30}
            height={30}
            className="cursor-pointer"
          />
        </SheetTrigger>
        <SheetContent>
          <ul className="mt-4 flex w-full flex-col items-start gap-6">
            {headerLinks.map((link) => {
              const isActive = link.route === pathname;

              return (
                <li
                  key={link.route}
                  className={`${
                    isActive && "gradient-text"
                  } p-16-medium flex whitespace-nowrap text-dark-400`}
                >
                  {link.nested ? (
                    <ul className="flex flex-col gap-6">
                      {link.nested.map((item) => (
                        <li
                          key={item.route}
                          className={`${
                            item.route === pathname && "gradient-text"
                          } p-16-medium flex whitespace-nowrap  text-dark-700`}
                        >
                          <Link href={item.route}>{item.label}</Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <Link href={link.route}>{link.label}</Link>
                  )}
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
};
