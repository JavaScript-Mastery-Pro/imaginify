"use client";

import React from "react";
import Image from "next/image";

import { useToast } from "@/components/ui/use-toast";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";
import { dataUrl, getImageSize } from "@/lib/utils";

type MediaUploaderProps = {
  onValueChange: (value: string) => void;
  setImage: React.Dispatch<any>;
  publicId: string;
  isAuthorized: boolean;
  image: any;
  type: string;
};

export const MediaUploader = ({
  onValueChange,
  setImage,
  publicId,
  isAuthorized,
  image,
  type,
}: MediaUploaderProps) => {
  const { toast } = useToast();

  // UPLOAD SUCCESS HANDLER
  const onUploadSuccess = (result: any) => {
    setImage((prevState: any) => ({
      ...prevState,
      publicId: result?.info?.public_id,
      width: result?.info?.width,
      height: result?.info?.height,
      secureURL: result?.info?.secure_url,
    }));

    onValueChange(result?.info?.public_id);

    toast({
      title: "Successfully uploaded!",
      description: "1 credit was deducted from your account",
      duration: 5000,
      className: "success-toast",
    });
  };

  return (
    <CldUploadWidget
      uploadPreset="imaginify"
      options={{
        multiple: false,
        resourceType: "image",
      }}
      onSuccess={onUploadSuccess}
      onError={() =>
        toast({
          title: "Something's wrong while uploading!",
          description: "Please try again",
          duration: 5000,
          className: "error-toast",
        })
      }
    >
      {({ open }) => {
        return (
          //  ORIGINAL IMAGE
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>

            {publicId ? (
              <>
                {/* RENDER UPLOADED IMAGE */}
                <div
                  className={`${
                    isAuthorized && "cursor-pointer"
                  } overflow-hidden rounded-[10px]`}
                  onClick={() => isAuthorized && open()}
                >
                  <CldImage
                    width={getImageSize(type, image, "width")}
                    height={getImageSize(type, image, "height")}
                    src={publicId}
                    alt="image"
                    placeholder={dataUrl as PlaceholderValue}
                    className="h-fit min-h-72 w-full  rounded-[10px] border border-dashed bg-purple-100/20 object-contain p-2"
                  />
                </div>
              </>
            ) : (
              // RENDER UPLOAD CTA
              <div
                className="flex-center flex h-72 cursor-pointer flex-col gap-5 rounded-[16px] border border-dashed bg-purple-100/20  shadow-inner"
                onClick={() => isAuthorized && open()}
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
