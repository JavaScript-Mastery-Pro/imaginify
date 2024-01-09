"use client";

import { useEffect, useState, useTransition } from "react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deductCredits } from "@/lib/actions/user.actions";

export const UseCreditsModal = ({ userId }: { userId: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
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
                router.back();
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
            Remaining Credits: 21/220
          </AlertDialogTitle>
          <AlertDialogDescription className="p-16-regular py-3">
            Using this service will deduct
            <span className="p-16-semibold text-dark-600"> 5 credits</span> from
            your remaining balance. Are you sure you want to proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="button w-full bg-purple-100 text-dark-400"
            onClick={() => router.back()}
          >
            No, Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="button w-full bg-purple-gradient  bg-cover"
            onClick={() =>
              startTransition(async () => {
                setIsOpen(false);
                await deductCredits(userId);
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
