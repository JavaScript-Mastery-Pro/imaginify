import Image from "next/image";
import { dataUrl } from "@/lib/utils";
import { CldUploadWidget, CldImage } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import React from "react";
import { Button } from "../ui/button";

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
          <div className="flex min-h-96 flex-col gap-4">
            <div className="flex-between">
              <h3 className="h3-bold text-dark-600">Original</h3>
              <Button
                type="button"
                variant="secondary"
                className="p-14-medium w-fit rounded-full border bg-purple-400/10 text-purple-500 transition-all hover:bg-purple-400/15"
                onClick={() => open()}
              >
                Upload New
              </Button>
            </div>

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
                    className="h-fit w-full rounded-[10px] border bg-white object-contain p-2"
                    placeholder={dataUrl as PlaceholderValue}
                  />
                </div>
              </>
            ) : (
              <div
                className="flex-center h-full max-h-[500px] cursor-pointer flex-col gap-5 rounded-[16px] border border-dashed bg-white"
                onClick={() => open()}
              >
                <Image
                  src="/assets/icons/add.svg"
                  alt="add image"
                  width={50}
                  height={50}
                />
                <p className="p-14-medium">Click here to upload image</p>
              </div>
            )}
          </div>
        );
      }}
    </CldUploadWidget>
  );
};
