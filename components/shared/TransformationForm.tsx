"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCldImageUrl } from "next-cloudinary";

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
import { IImage } from "@/lib/database/models/image.model";
import { CustomField } from "./CustomField";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { MediaUploader } from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { debounce } from "@/lib/utils";

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
  data?: IImage | null;
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  config?: Transformations;
};

type AspectRatioKey = keyof typeof aspectRatioOptions;

// COMPONENT
export const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config,
}: TransformationFormProps) => {
  const router = useRouter();
  const [image, setImage] = useState<any>(data);
  const [isSubmitting, setSubmitting] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);

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
    setSubmitting(true);

    if (data || image) {
      const transformationURL = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
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

    setSubmitting(false);
  };

  // HANDLE INPUT CHANGE
  const handleInputChange = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setTransformationConfig((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
    }, 1000)();

    return onChangeField(value);
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

        {/* ASPECT RATIO FIELD */}
        {type === "fill" && (
          <CustomField
            control={form.control}
            name="aspectRatio"
            formLabel="Aspect ratio"
            className="w-full"
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  const imageSize = aspectRatioOptions[value as AspectRatioKey];

                  setImage((prevState: any) => ({
                    ...prevState,
                    aspectRatio: imageSize.aspectRatio,
                    width: imageSize.width,
                    height: imageSize.height,
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
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        )}

        {(type === "remove" || type === "recolor") && (
          /* PROMPT FIELD */
          <div className="flex gap-10">
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
                  onChange={(e) =>
                    handleInputChange(
                      "prompt",
                      e.target.value,
                      type,
                      field.onChange
                    )
                  }
                />
              )}
            />

            {type === "recolor" && (
              /* COLOR FIELD */
              <CustomField
                control={form.control}
                name="color"
                formLabel="Replacement Color"
                className="w-full"
                render={({ field }) => (
                  <Input
                    value={field.value}
                    className="input-field"
                    onChange={(e) =>
                      handleInputChange(
                        "color",
                        e.target.value,
                        "recolor",
                        field.onChange
                      )
                    }
                  />
                )}
              />
            )}
          </div>
        )}

        <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-4 md:grid-cols-2">
          {/* MEDIA UPLOADER */}
          <CustomField
            control={form.control}
            name="publicId"
            className="flex h-full w-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
              />
            )}
          />

          {/* TRANSFORMED IMAGE */}
          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            transformationConfig={transformationConfig}
          />
        </div>

        {/* SAVE BUTTON */}
        <div className="flex flex-col gap-4">
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Transformation"}
          </Button>

          {/* DELETE BUTTON */}
          {data && <DeleteConfirmation imageId={data._id} />}
        </div>
      </form>
    </Form>
  );
};
