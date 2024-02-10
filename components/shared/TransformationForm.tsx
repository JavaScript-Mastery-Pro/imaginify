/* eslint-disable no-unused-vars */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { getCldImageUrl } from "next-cloudinary";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { updateCredits } from "@/lib/actions/user.actions";
import { IImage } from "@/lib/database/models/image.model";
import { debounce, deepMergeObjects } from "@/lib/utils";

import { CustomField } from "./CustomField";
import { InsufficientCreditsModal } from "./InsufficientCreditsModal";
import { MediaUploader } from "./MediaUploader";
import { TransformedImage } from "./TransformedImage";

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
  userId: string;
  type: TransformationTypeKey;
  creditBalance: number;
  data?: IImage | null;
  config?: Transformations | null;
};

type AspectRatioKey = keyof typeof aspectRatioOptions;

// COMPONENT
export const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const transformationType = transformationTypes[type]; // Defines the transformation configuration type that will be applied to transform the image

  const [image, setImage] = useState<any>(data); // Holds the uploaded image data
  const [isSubmitting, setSubmitting] = useState(false); // Loading state on image save

  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null); // Temporarily holds the transformation changes which will be applied after clickng the apply button
  const [transformationConfig, setTransformationConfig] = useState(config); // Holds the final transformation config that will be applied to the image
  const [isTransforming, setIsTransforming] = useState(false); // Loading state on image transformation

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

  // FORM
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // SUBMIT HANDLER
  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
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

      // Add Image
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
            router.push(`/transformations/${newImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }

      // Update Image
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

          if (updatedImage) router.push(`/transformations/${updatedImage._id}`);
        } catch (error) {
          console.log(error);
        }
      }
    }

    setSubmitting(false);
  };

  // INPUT CHANGE HANDLER
  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void
  ) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
    }, 1000)();

    return onChangeField(value);
  };

  // SELECT FIELD HANDLER
  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void
  ) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,
    }));

    setNewTransformation(transformationType.config);

    return onChangeField(value);
  };

  // TRANSFORM IMAGE HANDLER
  const onTransformHandler = async () => {
    setIsTransforming(true);

    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig) // deepMergeObjects is a custom function that merges two objects deeply created with chatgpt
    );

    setNewTransformation(null);

    startTransition(async () => {
      await updateCredits(userId, creditFee);
    });
  };

  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      setNewTransformation(transformationType.config);
    }
  }, [image, transformationType.config, type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-5">
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}

        {/* TITLE FIELD */}
        <CustomField
          control={form.control}
          name="title"
          formLabel="Image Title"
          className="w-full"
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
                onValueChange={(value) =>
                  onSelectFieldHandler(value, field.onChange)
                }
                value={field.value}
              >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select size" />
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
          <div className="prompt-field">
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
                    onInputChangeHandler(
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
                      onInputChangeHandler(
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

        <div className="media-uploader-field">
          {/* MEDIA UPLOADER */}
          <CustomField
            control={form.control}
            name="publicId"
            className="flex size-full flex-col"
            render={({ field }) => (
              <MediaUploader
                onValueChange={field.onChange}
                setImage={setImage}
                publicId={field.value}
                image={image}
                type={type}
              />
            )}
          />

          {/* TRANSFORMED IMAGE */}
          <TransformedImage
            image={image}
            type={type}
            title={form.getValues().title}
            isTransforming={isTransforming}
            setIsTransforming={setIsTransforming}
            transformationConfig={transformationConfig}
          />
        </div>

        {/* ACTIONS */}
        <div className={`flex flex-col gap-4`}>
          {/* APPLY TRANSFORMATION BUTTON */}
          <Button
            type="button"
            className="submit-button capitalize"
            disabled={isTransforming || newTransformation === null}
            onClick={onTransformHandler}
          >
            {isTransforming ? "Transforming..." : "Apply Transformation"}
          </Button>

          {/* SAVE BUTTON */}
          <Button
            type="submit"
            className="submit-button capitalize"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Image"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
