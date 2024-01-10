import Image from "next/image";

import { Collection } from "@/components/shared/Collection";
import { getAllImages } from "@/lib/actions/image.actions";

const Home = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;

  const images = await getAllImages({ page });

  return (
    <>
      {/* Banner */}
      <section className="hidden sm:block">
        <Image
          src="/assets/images/banner.png"
          alt="logo"
          width={2000}
          height={315}
          className="inline pb-5"
        />
      </section>

      <section className="sm:mt-12">
        <Collection
          hasSearch={false}
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Home;
