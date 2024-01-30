import Image from "next/image";
import Link from "next/link";
import { auth } from "@clerk/nextjs";

import { Header } from "@/components/shared/Header";
import { getImageById } from "@/lib/actions/image.actions";
import TransformedImage from "@/components/shared/TransformedImage";
import { getImageSize } from "@/lib/utils";
import { DeleteConfirmation } from "@/components/shared/DeleteConfirmation";
import { Button } from "@/components/ui/button";

const ImageDetails = async ({ params: { id } }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const image = await getImageById(id);

  return (
    <>
      <Header title={image.title} />

      <section className="flex flex-col gap-2 px-2 md:flex-row md:gap-4">
        <div className="flex gap-2">
          <p className="p-16-semibold">Transformation:</p>
          <p className=" capitalize">{image.transformationType}</p>
        </div>

        {image.prompt && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="flex gap-2">
              <p className="p-16-semibold">Prompt:</p>
              <p className=" capitalize">{image.prompt}</p>
            </div>
          </>
        )}

        {image.color && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="flex gap-2">
              <p className="p-16-semibold">Color:</p>
              <p className=" capitalize">{image.color}</p>
            </div>
          </>
        )}

        {image.aspectRatio && (
          <>
            <p className="hidden text-dark-400/50 md:block">&#x25CF;</p>
            <div className="flex gap-2">
              <p className="p-16-semibold">Aspect Ratio:</p>
              <p className=" capitalize">{image.aspectRatio}</p>
            </div>
          </>
        )}
      </section>

      <section className="mt-10 border-t border-dark-400/10">
        <div className="grid h-fit min-h-[200px] grid-cols-1 gap-5 py-8 md:grid-cols-2">
          {/* MEDIA UPLOADER */}
          <div className="flex flex-col gap-4">
            <h3 className="h3-bold text-dark-600">Original</h3>

            <Image
              width={getImageSize(image.transformationType, image, "width")}
              height={getImageSize(image.transformationType, image, "height")}
              src={image.secureURL}
              alt="image"
              className="h-fit min-h-72 w-full rounded-[10px] border border-dashed bg-purple-100/20 object-cover p-2"
            />
          </div>

          {/* TRANSFORMED IMAGE */}
          <TransformedImage
            image={image}
            type={image.transformationType}
            title={image.title}
            isTransforming={false}
            transformationConfig={image.config}
            hasDownload={true}
          />
        </div>

        {userId === image.author._id && (
          <div className="mt-8 space-y-4">
            <Button asChild type="button" className="submit-button capitalize">
              <Link href={`/transformations/${image._id}/update`}>
                Update Image
              </Link>
            </Button>

            <DeleteConfirmation imageId={image._id} />
          </div>
        )}
      </section>
    </>
  );
};

export default ImageDetails;