"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
  targetObject: z.string().optional(),
  prompt: z.string().optional(),
});

// COMPONENT
export const ServiceForm = () => {
  const initialValues = serviceInitialValues;

  // Form
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialValues,
  });

  // Submit Handler
  const onSubmit = (values: z.infer<typeof serviceFormSchema>) => {
    console.log({ values });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CustomField
          control={form.control}
          name="title"
          formLabel="Title"
          className="w-full"
          render={({ field }) => <Input placeholder="shadcn" {...field} />}
        />

        <CustomField
          control={form.control}
          name="imageUrl"
          formLabel="Upload"
          className="w-full"
          render={({ field }) => <Input placeholder="shadcn" {...field} />}
        />

        <CustomField
          control={form.control}
          name="serviceType"
          formLabel="Service type"
          className="w-full"
          render={({ field }) => <Input placeholder="shadcn" {...field} />}
        />

        <CustomField
          control={form.control}
          name="aspectRatio"
          formLabel="Aspect ratio"
          className="w-full"
          render={({ field }) => <Input placeholder="shadcn" {...field} />}
        />

        <CustomField
          control={form.control}
          name="targetObject"
          formLabel="Target Object"
          className="w-full"
          render={({ field }) => <Input placeholder="shadcn" {...field} />}
        />

        <CustomField
          control={form.control}
          name="prompt"
          formLabel="Prompt"
          className="w-full"
          render={({ field }) => <Input placeholder="shadcn" {...field} />}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};
