import Image from "next/image";
import { SignedIn, auth } from "@clerk/nextjs";

import { plans } from "@/constants";
import { Header } from "@/components/shared/Header";
import Checkout from "@/components/shared/Checkout";
import { Button } from "@/components/ui/button";

const Credits = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <Header
        title="Buy Credits"
        subTitle="Choose a credit package that suits your needs!"
      />

      <section>
        <ul className="mt-11 flex flex-col gap-5 md:flex-row md:gap-9">
          {plans.map((plan) => (
            <li
              key={plan.name}
              className="w-full rounded-[16px] border-2 border-purple-200/20 bg-white p-8 shadow-xl shadow-purple-200/20 "
            >
              <div className="flex-center flex-col gap-3">
                <Image src={plan.icon} alt="check" width={50} height={50} />
                <p className="p-20-semibold mt-2 text-purple-500">
                  {plan.name}
                </p>
                <p className="h1-semibold text-dark-600">${plan.price}</p>
                <p className="p-16-regular">{plan.credits} Credits</p>
              </div>

              {/* Inclusions */}
              <ul className="flex flex-col gap-5 py-9">
                {plan.inclusions.map((inclusion) => (
                  <li
                    key={plan.name + inclusion.label}
                    className="flex items-center gap-4"
                  >
                    <Image
                      src={`/assets/icons/${
                        inclusion.isIncluded ? "check.svg" : "cross.svg"
                      }`}
                      alt="check"
                      width={24}
                      height={24}
                    />
                    <p className="p-16-regular">{inclusion.label}</p>
                  </li>
                ))}
              </ul>

              {plan.name === "Free" ? (
                <Button
                  variant="outline"
                  className="w-full rounded-full bg-purple-100 bg-cover text-purple-500 hover:text-purple-500"
                >
                  Free Consumable
                </Button>
              ) : (
                <SignedIn>
                  <Checkout
                    plan={plan.name}
                    amount={plan.price}
                    credits={plan.credits}
                    buyerId={userId}
                  />
                </SignedIn>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Credits;
