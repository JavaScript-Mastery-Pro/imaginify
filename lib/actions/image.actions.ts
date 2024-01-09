"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { handleError } from "@/lib//utils";
import User from "@/lib/database/models/user.model";
import Image from "../database/models/image.model";
import { connectToDatabase } from "@/lib/database/mongoose";

// POPULATE USER
const populateUser = (query: any) => {
  return query.populate({
    path: "author",
    model: User,
    select: "_id firstName lastName",
  });
};

// ADD
export async function addImage({ image, userId, path }: AddImageParams) {
  try {
    await connectToDatabase();

    const author = await User.findById(userId);
    if (!author) throw new Error("Author not found");

    const newImage = await Image.create({
      ...image,
      author: author._id,
    });
    revalidatePath(path);

    return JSON.parse(JSON.stringify(newImage));
  } catch (error) {
    handleError(error);
  }
}

// GET ALL
export async function getAllImages({
  limit = 5,
  page = 1,
}: {
  limit?: number;
  page: number;
}) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find())
      .sort({ updatedAt: -1 }) // Sort by highest upvotes
      .skip(skipAmount)
      .limit(limit);

    const imagesCount = await Image.countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(imagesCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

// GET ONE
export async function getImageById(imageId: string) {
  try {
    await connectToDatabase();

    const image = await populateUser(Image.findById(imageId));

    if (!image) throw new Error("Image not found");

    return JSON.parse(JSON.stringify(image));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateImage({ userId, image, path }: UpdateImageParams) {
  try {
    await connectToDatabase();

    const imageToUpdate = await Image.findById(image._id);

    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) {
      throw new Error("Unauthorized or image not found");
    }

    const updatedImage = await Image.findByIdAndUpdate(
      imageToUpdate._id,
      image,
      { new: true }
    );
    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedImage));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteImage({ imageId }: { imageId: string }) {
  try {
    await connectToDatabase();

    await Image.findByIdAndDelete(imageId);
  } catch (error) {
    handleError(error);
  } finally {
    redirect("/");
  }
}
