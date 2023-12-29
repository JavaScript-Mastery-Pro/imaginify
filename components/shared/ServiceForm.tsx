"use client";

import { useState } from "react";

import Image from "next/image";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadWidget, CldImage } from "next-cloudinary";

import { serviceInitialValues } from "@/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CustomField } from "./CustomField";

// ZOD VALIDATION
export const serviceFormSchema = z.object({
  title: z.string(),
  imageUrl: z.string(),
  transformedImageUrl: z.string(),
  serviceType: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
});

type ServiceFormProps = {
  type: "Restore Image" | "Fill Image" | "Remove Object" | "Recolor Item";
  config?: {
    remove?: {
      prompt: string;
      removeShadow?: true;
      multiple?: true;
    };
    restore?: boolean;
    fillBackground?: boolean;
    recolor?: {
      prompt?: string;
      to: string;
      multiple?: true;
    };
  };
};

// COMPONENT
export const ServiceForm = ({
  type = "Restore Image",
  config,
}: ServiceFormProps) => {
  const [image, setImage] = useState<any>();
  const [transformation, setTransformation] = useState(config);

  const initialValues = serviceInitialValues;

  // Form
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialValues,
  });

  // Submit Handler
  const onSubmit = (values: z.infer<typeof serviceFormSchema>) => {
    if (image) {
      console.log({
        ...values,
        imageUrl: image?.public_id,
        serviceType: type,
        prompt:
          transformation?.recolor?.prompt || transformation?.remove?.prompt,
      });
    }
  };

  console.log({ transformation });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full "
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "Fill Image" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect ratio"
            className="w-full"
            render={({ field }) => <Input {...field} className="input-field" />}
          />
        )}

        {(type === "Remove Object" || type === "Recolor Item") && (
          <CustomField
            control={form.control}
            name="prompt"
            formLabel={
              type === "Remove Object" ? "Item to Remove" : "Item to Recolor"
            }
            className="w-full"
            render={({ field }) => (
              <Input
                className="input-field"
                onChange={(e) => {
                  field.onChange(
                    setTransformation((prevState) => ({
                      ...prevState,
                      [type === "Remove Object" ? "remove" : "recolor"]: {
                        ...prevState?.remove,
                        prompt: e.target.value,
                      },
                    }))
                  );
                }}
              />
            )}
          />
        )}

        {type === "Recolor Item" && (
          <CustomField
            control={form.control}
            name="color"
            formLabel="Replacement Color"
            className="w-full"
            render={({ field }) => (
              <Input
                className="input-field"
                onChange={(e) => {
                  field.onChange(
                    setTransformation((prevState) => ({
                      ...prevState,
                      recolor: { ...prevState?.recolor, to: e.target.value },
                    }))
                  );
                }}
              />
            )}
          />
        )}

        <CustomField
          control={form.control}
          name="imageUrl"
          formLabel="Upload Image"
          className="flex h-full w-full flex-col "
          render={({ field }) => (
            <CldUploadWidget
              {...field}
              uploadPreset="imaginify"
              autoUpload={false}
              options={{
                multiple: false,
              }}
              onSuccess={(result) => {
                setImage(result?.info);
              }}
            >
              {({ open }) => {
                return (
                  <>
                    {image ? (
                      <div className="grid h-fit max-h-[600px] grid-cols-1 gap-5 md:grid-cols-2">
                        {/* Original Image */}
                        <div className="mt-4 flex flex-col gap-4">
                          <h3 className="h3-bold  text-dark-600">
                            Original Image
                          </h3>

                          <div
                            className="relative overflow-hidden rounded-[10px]"
                            onClick={() => open()}
                          >
                            <CldImage
                              width="1000"
                              height="1000"
                              src={
                                image?.public_id || "imaginify/image_225_t3omjy"
                              }
                              alt="image"
                              className="h-full w-full rounded-[10px] border bg-white object-contain p-2"
                            />

                            {/* Hover overlay */}
                            <div className="flex-center absolute left-0 top-0 h-full w-full cursor-pointer bg-dark-600/70 text-white opacity-0 transition-all hover:opacity-100 ">
                              <p>Reupload</p>
                            </div>
                          </div>

                          {/* Bottom note */}
                          <p className="p-14-medium px-2">
                            Hover the image above to reupload
                          </p>
                        </div>

                        {/* Transformed Image */}
                        <div className="mt-4 flex flex-col gap-4">
                          <h3 className="h3-bold  text-dark-600">
                            Transformed Image
                          </h3>

                          <CldImage
                            width="1000"
                            height="1000"
                            src={
                              image?.public_id || "imaginify/image_225_t3omjy"
                            }
                            alt="image"
                            {...transformation}
                            className="h-full w-full rounded-[10px] border  bg-white object-contain p-2"
                          />

                          {/* Bottom note */}
                          <div className="p-14-medium flex items-center gap-2 px-2">
                            <Image
                              src="/assets/icons/download.svg"
                              alt="add image"
                              width={20}
                              height={20}
                            />
                            <p className="p-14-medium mt-1">Download</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex-center h-60 max-h-[600px] cursor-pointer flex-col gap-5 rounded-[16px] border border-dashed bg-white"
                        onClick={() => open()}
                      >
                        <Image
                          src="/assets/icons/add.svg"
                          alt="add image"
                          width={50}
                          height={50}
                        />
                        <p className="p-10-medium">Supports all image format</p>
                      </div>
                    )}
                  </>
                );
              }}
            </CldUploadWidget>
          )}
        />

        <Button type="submit" className="submit-button">
          {type}
        </Button>
      </form>
    </Form>
  );
};
