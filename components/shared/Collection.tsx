"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formUrlQuery } from "@/lib/utils";
import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";
import { Button } from "../ui/button";

export const Collection = ({
  hasSearch = true,
  images,
  totalPages = 1,
  page,
}: {
  images: IImage[];
  totalPages?: number;
  page: number;
  hasSearch?: boolean;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const onClick = (action: string) => {
    const pageValue = action === "next" ? Number(page) + 1 : Number(page) - 1;

    const newUrl = formUrlQuery({
      searchParams,
      key: "page",
      value: pageValue,
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <>
      <div className="md:flex-between mb-6 flex flex-col gap-5 md:flex-row">
        <h2 className="h2-bold text-dark-600">Recent Edits</h2>
        {hasSearch && (
          <Input
            className="search-field p-14-medium w-full max-w-96 rounded-full border-0 placeholder:text-dark-400"
            placeholder="Search title"
          />
        )}
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image) => (
          <Card image={image} key={image.id} />
        ))}
      </ul>

      {totalPages > 1 ? (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            <Button
              disabled={Number(page) <= 1}
              className="button w-36 bg-purple-gradient bg-cover text-white"
              onClick={() => onClick("prev")}
            >
              <PaginationPrevious className="hover:bg-transparent hover:text-white" />
            </Button>

            <p className="flex-center w-full flex-1">
              {page} / {totalPages}
            </p>

            <Button
              className="button w-36 bg-purple-gradient bg-cover text-white "
              onClick={() => onClick("next")}
              disabled={Number(page) >= totalPages}
            >
              <PaginationNext className="hover:bg-transparent hover:text-white" />
            </Button>
          </PaginationContent>
        </Pagination>
      ) : (
        <div className="flex-center h-60 w-full rounded-[10px] border border-dark-400/10 bg-white/20">
          <p className="p-20-semibold">No Recent Edits</p>
        </div>
      )}
    </>
  );
};

const Card = ({ image }: { image: IImage }) => {
  return (
    <li>
      <Link
        href={`/transformations/${image._id}/update`}
        className="flex flex-1 cursor-pointer flex-col gap-5 rounded-[16px] bg-white p-4 shadow-sm hover:shadow-md"
      >
        <CldImage
          src={image.publicId}
          alt="logo"
          width={200}
          height={200}
          className="h-48 w-full rounded-[10px] object-cover"
          {...image.config}
        />
        <div className="flex-between">
          <p>{image.title}</p>
          <Image
            src={`/assets/icons/${
              transformationTypes[
                image.transformationType as TransformationTypeKey
              ].icon
            }`}
            alt={image.title}
            width={24}
            height={24}
          />
        </div>
      </Link>
    </li>
  );
};
