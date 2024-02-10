"use client";

import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import { CldImage, getCldImageUrl } from "next-cloudinary";

import { dataUrl, debounce, download, getImageSize } from "@/lib/utils";

type TransformedImageProps = {
  image: any;
  type: string;
  title: string;
  transformationConfig: Transformations | null;
  isTransforming: boolean;
  hasDownload?: boolean;
  setIsTransforming?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TransformedImage = ({
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
          <button className="download-btn" onClick={(e) => downloadHandler(e)}>
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
              debounce(() => {
                setIsTransforming && setIsTransforming(false);
              }, 8000)();
            }}
            sizes="(max-width: 767px) 100vw, 50vw"
            {...transformationConfig} // Image transformations
            className="transformed-image"
          />

          {isTransforming && (
            <div className="tranforming-loader">
              <Image
                src="/assets/icons/spinner.svg"
                width={50}
                height={50}
                alt="spinner"
              />
              <p className="text-white/80">Please wait...</p>
            </div>
          )}
        </div>
      ) : (
        // TRANSFORMED IMAGE PLACEHOLDER
        <div className="transformed-placeholder">Transformed Image</div>
      )}
    </div>
  );
};
