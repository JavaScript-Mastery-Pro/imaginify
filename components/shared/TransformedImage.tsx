import Image from "next/image";

import { dataUrl, download, getImageSize } from "@/lib/utils";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

type TransformedImageProps = {
  image: any;
  type: string;
  title: string;
  disabled: boolean;
  transformationConfig: Transformations | undefined;
};

const TransformedImage = ({
  image,
  type,
  title,
  disabled,
  transformationConfig,
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
        <button
          className={`${
            disabled ? "hidden" : "flex"
          } p-14-medium items-center gap-2 px-2`}
          onClick={(e) => downloadHandler(e)}
        >
          <Image
            src="/assets/icons/download.svg"
            alt="add image"
            width={24}
            height={24}
            className="pb-1"
          />
          Download
        </button>
      </div>

      {/* TRANSFORMED IMAGE */}
      {image?.publicId ? (
        <>
          <CldImage
            width={getImageSize(type, image, "width")}
            height={getImageSize(type, image, "height")}
            src={image?.publicId}
            alt="image"
            placeholder={dataUrl as PlaceholderValue}
            {...transformationConfig}
            className="h-full min-h-72 w-full rounded-[10px] border border-dashed bg-purple-100/20 object-contain p-2"
          />
        </>
      ) : (
        // TRANSFORMED IMAGE PLACEHOLDER
        <div className="flex-center p-14-medium h-72 flex-col gap-5 rounded-[16px] border border-dashed bg-purple-100/20 shadow-inner">
          Transformed Image
        </div>
      )}
    </div>
  );
};

export default TransformedImage;
