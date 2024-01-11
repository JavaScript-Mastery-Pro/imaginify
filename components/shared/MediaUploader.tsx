import React from "react";
import Image from "next/image";
import { CldImage, CldUploadWidget } from "next-cloudinary";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  disabled: boolean;
};

export const MediaUploader = ({
  onValueChange,
  setImage,
  publicId,
  disabled,
}: MediaUploaderProps) => {
  return (
    <CldUploadWidget
      uploadPreset="imaginify"
      options={{
        multiple: false,
      }}
      onSuccess={(result: any) => {
        if (result.event === "success") {
          setImage((prevState: any) => ({
            ...prevState,
            publicId: result?.info?.public_id,
            width: result?.info?.width,
            height: result?.info?.height,
            secureURL: result?.info?.secure_url,
          }));

          onValueChange(result?.info?.public_id);
        }
      }}
    >
      {({ open }) => {
        return (
          //  ORIGINAL IMAGE
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>

            {publicId ? (
              <>
                <div
                  className={`${
                    !disabled && "cursor-pointer"
                  } overflow-hidden rounded-[10px]`}
                  onClick={() => !disabled && open()}
                >
                  <CldImage
                    width={1000}
                    height={1000}
                    src={publicId}
                    alt="image"
                    className="h-fit min-h-72 w-full  rounded-[10px] border border-dashed bg-purple-100 object-contain p-2"
                  />
                </div>
              </>
            ) : (
              <div
                className="flex-center flex h-72 cursor-pointer flex-col gap-5 rounded-[16px] border border-dashed bg-purple-100/20  shadow-inner"
                onClick={() => !disabled && open()}
              >
                <div className="rounded-[16px] bg-white  p-5 shadow-sm shadow-purple-200/50">
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
