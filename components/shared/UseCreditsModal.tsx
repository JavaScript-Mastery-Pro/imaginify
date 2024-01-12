"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateCredits } from "@/lib/actions/user.actions";
import { creditFee } from "@/constants";

export const UseCreditsModal = ({
  userId,
  creditBalance,
}: {
  userId: string;
  creditBalance: number;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <AlertDialog defaultOpen>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2 flex items-start justify-between">
            <Image
              src="/assets/icons/credit-coins.svg"
              alt="credit coins"
              width={56}
              height={56}
            />
            <AlertDialogCancel
              className="border-0 p-0 hover:bg-transparent"
              onClick={() => {
                router.push("/profile");
              }}
            >
              <Image
                src="/assets/icons/close.svg"
                alt="credit coins"
                width={24}
                height={24}
                className="cursor-pointer"
              />
            </AlertDialogCancel>
          </div>
          <AlertDialogTitle className="p-24-bold text-dark-600">
            Remaining Credits: {creditBalance}
          </AlertDialogTitle>
          <AlertDialogDescription className="p-16-regular py-3">
            Using this service will deduct
            <span className="p-16-semibold text-dark-600">
              {creditFee} credit
            </span>
            from your remaining balance. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="button w-full bg-purple-100 text-dark-400 hover:text-dark-400"
            onClick={() => router.push("/profile")}
          >
            No, Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="button w-full bg-purple-gradient  bg-cover"
            onClick={() =>
              startTransition(async () => {
                await updateCredits(userId, creditFee);
              })
            }
          >
            {isPending ? "Processing..." : "Yes, Proceed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
