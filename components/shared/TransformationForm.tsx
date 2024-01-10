"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldImage, getCldImageUrl } from "next-cloudinary";
import { PlaceholderValue } from "next/dist/shared/lib/get-img-props";

import { aspectRatioOptions, defaultValues } from "@/constants";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustomField } from "./CustomField";
import { dataUrl, download } from "@/lib/utils";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { IImage } from "@/lib/database/models/image.model";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { FileUplaoder } from "./FileUplaoder";

// ZOD VALIDATION
export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

// PROP TYPE
type TransformationFormProps = {
  action: "Add" | "Update";
  data?: IImage;
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  config?: {
    height?: number;
    remove?: {
      prompt: string;
      removeShadow?: boolean;
      multiple?: boolean;
    };
    restore?: boolean;
    fillBackground?: boolean;
    recolor?: {
      prompt?: string;
      to: string;
      multiple?: boolean;
    };
  };
};

// COMPONENT
export const TransformationForm = ({
  action,
  data,
  userId,
  type,
  creditBalance,
  config,
}: TransformationFormProps) => {
  const router = useRouter();
  const [image, setImage] = useState<any>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);

  console.log({ image });

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  // Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Submit Handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    if (data || image) {
      const transformationURL = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...config,
      });

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };

      // Add Product
      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: "/",
          });

          if (newImage) {
            form.reset();
            setImage(data);
            router.push(`/transformations/${newImage._id}/update`);
          }
        } catch (error) {
          console.log(error);
        }
      }

      // Update Event
      if (action === "Update") {
        if (!data) return router.back();

        try {
          const updatedImage = await updateImage({
            userId,
            image: {
              ...imageData,
              _id: data._id,
            },
            path: `/transformations/${data._id}`,
          });

          if (updatedImage) router.push("/profile");
        } catch (error) {
          console.log(error);
        }
      }
    }

    setIsLoading(false);
  };

  const downloadHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    download(
      getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...config,
      }),
      form.getValues().title
    );
  };

  return (
    <Form {...form}>
      {/* {creditBalance > 5 ? (
        <UseCreditsModal userId={userId} creditBalance={creditBalance} />
      ) : (
        <InsufficientCreditsModal />
      )} */}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full "
          render={({ field }) => <Input {...field} className="input-field" />}
        />

        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  setImage((prevState: any) => ({
                    ...prevState,
                    height:
                      aspectRatioOptions[
                        value as keyof typeof aspectRatioOptions
                      ].height,
                  }));
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key} className="select-item">
                      {
                        aspectRatioOptions[
                          key as keyof typeof aspectRatioOptions
                        ].label
                      }
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          <div className="flex gap-10">
            {/* PROMPT */}
            <CustomField
              control={form.control}
              name="prompt"
              formLabel={
                type === "remove" ? "Object to Remove" : "Object to Recolor"
              }
              className="w-full"
              render={({ field }) => (
                <Input
                  value={field.value}
                  className="input-field"
                  onChange={(e) => {
                    let timeoutId = null;
                    if (timeoutId) clearTimeout(timeoutId);

                    timeoutId = setTimeout(() => {
                      setTransformationConfig(
                        (prevState: typeof transformationConfig) => ({
                          ...prevState,
                          [type === "remove" ? "remove" : "recolor"]: {
                            ...prevState?.[type],
                            prompt: e.target.value,
                          },
                        })
                      );
                    }, 1500);

                    field.onChange(e.target.value);
                  }}
                />
              )}
            />

            {type === "recolor" && (
              // COLOR
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) => {
                      let timeoutId = null;
                      if (timeoutId) clearTimeout(timeoutId);

                      timeoutId = setTimeout(() => {
                        setTransformationConfig(
                          (prevState: typeof transformationConfig) => ({
                            ...prevState,
                            recolor: {
                              ...prevState?.recolor,
                              to: e.target.value,
                            },
                          })
                        );
                      }, 1500);

                      field.onChange(e.target.value);
                    }}
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-4 md:grid-cols-2">
          {/* Uploader  */}
          <CustomField
            control={form.control}
            name="publicId"
            className="flex h-full w-full flex-col"
            render={({ field }) => (
              <FileUplaoder
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
              />
            )}
          />

          {/* Transformed Image */}
          <div className="flex flex-col gap-4">
            <div className="flex-between">
              <h3 className="h3-bold text-dark-600">Transformed</h3>
              <button
                className="p-14-medium flex items-center gap-2 px-2"
                onClick={(e) => downloadHandler(e)}
              >
                <Image
                  src="/assets/icons/download.svg"
                  alt="add image"
                  width={20}
                  height={20}
                />
                Download
              </button>
            </div>

            {image ? (
              <>
                {/* Todo: fix height issue */}
                <CldImage
                  width={1000}
                  height={type === "fill" ? image?.height : 100}
                  src={image?.publicId}
                  alt="image"
                  placeholder={dataUrl as PlaceholderValue}
                  {...transformationConfig}
                  className="h-full min-h-60 w-full rounded-[10px] border bg-white object-contain p-2"
                />
              </>
            ) : (
              <div className="flex-center p-14-medium h-60 cursor-pointer flex-col gap-5 rounded-[16px] border-dashed bg-white">
                Transformed Image
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Transformation"}
          </Button>

          {data && <DeleteConfirmation imageId={data._id} />}
        </div>
      </form>
    </Form>
  );
};
