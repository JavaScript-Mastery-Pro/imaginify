import { auth } from "@clerk/nextjs";
import { Header } from "@/components/shared/Header";
import { TransformationForm } from "@/components/shared/Form";
import { getImageById } from "@/lib/actions/image.actions";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";

const UpdateImage = async ({ params: { id } }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const user = await getUserById(userId);
  const image = await getImageById(id);
  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <>
      <Header title={transformation.title} subTitle={transformation.subTitle} />

      <section className="mt-14">
        <TransformationForm
          action="Update"
          userId={userId}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default UpdateImage;
