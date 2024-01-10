import Image from "next/image";
import { auth } from "@clerk/nextjs";

import { Header } from "@/components/shared/Header";
import { Collection } from "@/components/shared/Collection";
import { getUserById } from "@/lib/actions/user.actions";
import { getAllImages } from "@/lib/actions/image.actions";

const Profile = async ({ searchParams }: SearchParamProps) => {
  const searchQuery = (searchParams?.query as string) || "";
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const page = Number(searchParams?.page) || 1;

  const user = await getUserById(userId);
  const images = await getAllImages({ page, searchQuery });

  return (
    <>
      <Header title="Profile" />

      <section className="mt-4 flex flex-col gap-5 sm:flex-row md:mt-8 md:gap-10">
        <div className="w-full rounded-[16px] bg-white p-5 md:px-6 md:py-8">
          <p className="p-14-medium md:p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="h-9 w-9 md:h-12 md:w-12"
            />
            <h2 className="h2-bold text-dark-600">{user.creditBalance}</h2>
          </div>
        </div>

        <div className="w-full rounded-[16px] bg-white p-5 md:px-6 md:py-8">
          <p className="p-14-medium md:p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="h-9 w-9 md:h-12 md:w-12"
            />
            <h2 className="h2-bold text-dark-600">{images?.savedImages}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-12">
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;
