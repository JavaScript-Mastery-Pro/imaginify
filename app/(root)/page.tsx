import { Collection } from "@/components/shared/Collection";
import Image from "next/image";

export default function Home() {
  return (
    <>
      {/* Banner */}
      <section>
        <Image
          src="/assets/images/home-banner.png"
          alt="logo"
          width={2000}
          height={315}
          className="ml-2 inline pb-5"
        />
      </section>

      <section className="mt-14">
        <h2 className="h2-bold mb-6 text-dark-600">Recent Edits</h2>
        <Collection />
      </section>
    </>
  );
}
