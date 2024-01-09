"use client";

import Image from "next/image";
import Link from "next/link";
import { CldImage } from "next-cloudinary";

import { Input } from "../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { transformationTypes } from "@/constants";
import { IImage } from "@/lib/database/models/image.model";

export const Collection = ({
  hasSearch = true,
  images,
}: {
  hasSearch?: boolean;
  images: IImage[];
}) => {
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

      {images.length === 0 && (
        <div className="flex-center h-60 w-full rounded-[10px] border border-dark-400/10 bg-white/20">
          <p className="p-20-semibold">No Recent Edits</p>
        </div>
      )}

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image) => (
          <Card image={image} key={image.id} />
        ))}
      </ul>

      {images.length > 2 && (
        <Pagination className="mt-10">
          <PaginationContent className="flex w-full">
            {/* <PaginationItem> */}
            <PaginationPrevious
              href="#"
              className="button w-36 bg-purple-gradient bg-cover text-white"
            />
            {/* </PaginationItem> */}

            <div className="flex-center w-full flex-1">
              {/* <PaginationItem> */}
              <PaginationLink href="#" isActive className="rounded-full">
                1
              </PaginationLink>
              {/* </PaginationItem> */}
              {/* <PaginationItem> */}
              <PaginationLink href="#" className="rounded-full">
                2
              </PaginationLink>
              {/* </PaginationItem> */}
              {/* <PaginationItem> */}
              <PaginationLink href="#" className="rounded-full">
                3
              </PaginationLink>
              {/* </PaginationItem> */}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </div>

            {/* <PaginationItem> */}
            <PaginationNext
              href="#"
              className="button w-36 bg-purple-gradient bg-cover text-white"
            />
            {/* </PaginationItem> */}
          </PaginationContent>
        </Pagination>
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
