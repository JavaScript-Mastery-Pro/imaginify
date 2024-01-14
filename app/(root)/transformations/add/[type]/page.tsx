import { auth } from "@clerk/nextjs";

import { Header } from "@/components/shared/Header";
import { TransformationForm } from "@/components/shared/TransformationForm";
import { transformationTypes } from "@/constants";
import { getUserById } from "@/lib/actions/user.actions";

const AddImage = async ({ params: { type } }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const user = await getUserById(userId);
  const transformation = transformationTypes[type];

  return (
    <>
      <Header title={transformation.title} subTitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={userId}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </>
  );
};

export default AddImage;
