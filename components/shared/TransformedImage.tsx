"use client";

import Image from "next/image";

import { dataUrl, download, getImageSize } from "@/lib/utils";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type TransformedImageProps = {
  image: any;
  type: string;
  title: string;
  transformationConfig: Transformations | null;
  isTransforming: boolean;
  hasDownload?: boolean;
  setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
};

const TransformedImage = ({
  image,
  type,
  title,
  transformationConfig,
  isTransforming,
  setIsTransforming,
  hasDownload = false,
}: TransformedImageProps) => {
  // DOWNLOAD HANDLER
  const downloadHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      }),
      title
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex-between ">
        <h3 className="h3-bold text-dark-600">Transformed</h3>

        {/* DOWNLOAD BUTTON */}
        {hasDownload && (
          <button
            className={"p-14-medium mt-2 flex items-center gap-2 px-2"}
            onClick={(e) => downloadHandler(e)}
          >
            <Image
              src="/assets/icons/download.svg"
              alt="add image"
              width={24}
              height={24}
              className="pb-[6px]"
            />
            Download
          </button>
        )}
      </div>

      {/* TRANSFORMED IMAGE */}
      {image?.publicId && transformationConfig ? (
        <div className="relative">
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt={image.title}
            placeholder={dataUrl as PlaceholderValue}
            onLoad={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            onError={() => {
              setIsTransforming && setIsTransforming(false);
            }}
            sizes="(max-width: 767px) 100vw, 50vw"
            {...transformationConfig} // Image transformations
            className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-purple-100/20 object-cover p-2"
          />

          {isTransforming && (
            <div className="flex-center absolute left-[50%] top-[50%] size-full -translate-x-1/2 -translate-y-1/2 border bg-dark-700/30">
              <Image
                src="/assets/icons/spinner.svg"
                width={50}
                height={50}
                alt="spinner"
              />
            </div>
          )}
        </div>
      ) : (
        // TRANSFORMED IMAGE PLACEHOLDER
        <div className="flex-center p-14-medium h-full min-h-72 flex-col gap-5 rounded-[16px] border border-dashed bg-purple-100/20 shadow-inner">
          Transformed Image
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
