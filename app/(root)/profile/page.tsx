import Image from "next/image";
import { auth } from "@clerk/nextjs";

import { Header } from "@/components/shared/Header";
import { Collection } from "@/components/shared/Collection";
import { getUserById } from "@/lib/actions/user.actions";

const Profile = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const user = await getUserById(userId);

  return (
    <>
      <Header title="Profile" />

      <section className="mt-8 flex gap-10">
        <div className="w-full rounded-[16px] bg-white px-6 py-8">
          <p className="p-16-medium">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
            />
            <h2 className="h2-bold text-dark-600">${user.creditBalance}</h2>
          </div>
        </div>
        <div className="w-full rounded-[16px] bg-white px-6 py-8">
          <p className="p-16-medium">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photos.svg"
              alt="coins"
              width={50}
              height={50}
            />
            <h2 className="h2-bold text-dark-600">54</h2>
          </div>
        </div>
      </section>

      <section className="mt-14">
        <h2 className="h2-bold mb-6 text-dark-600">Recent Edits</h2>
        <Collection />
      </section>
    </>
  );
};

export default Profile;
