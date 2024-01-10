import Image from "next/image";
import { dataUrl } from "@/lib/utils";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import React from "react";

type FileUplaoderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
};

export const FileUplaoder = ({
  onValueChange,
  setImage,
  publicId,
}: FileUplaoderProps) => {
  return (
    <CldUploadWidget
      uploadPreset="imaginify"
      options={{
        multiple: false,
      }}
      onSuccess={(result: any) => {
        if (result.event === "success") {
          const imageDetails = {
            publicId: result?.info?.public_id,
            width: result?.info?.width,
            height: result?.info?.height,
            secureURL: result?.info?.secure_url,
          };

          setImage(imageDetails);
          onValueChange(result?.info?.public_id);
        }
      }}
    >
      {({ open }) => {
        return (
          // Original Image
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>

            {publicId ? (
              <>
                <div
                  className="cursor-pointer overflow-hidden rounded-[10px]"
                  onClick={() => open()}
                >
                  <CldImage
                    width={1000}
                    height={1000}
                    src={publicId}
                    alt="image"
                    className="h-fit min-h-60 w-full rounded-[10px] border bg-purple-100 object-contain p-2"
                    placeholder={dataUrl as PlaceholderValue}
                  />
                </div>
              </>
            ) : (
              <div
                className="flex-center h-60 max-h-[500px] cursor-pointer flex-col gap-5 rounded-[16px] border border-dashed bg-purple-100"
                onClick={() => open()}
              >
                <div className="rounded-[16px] bg-white p-5 shadow-sm shadow-purple-200/50">
                  <Image
                    src="/assets/icons/add.svg"
                    alt="add image"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="p-14-medium">Click here to upload image</p>
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};
