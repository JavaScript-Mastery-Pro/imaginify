"use client";

import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

import { Button } from "../ui/button";
import { checkoutOrder } from "@/lib/actions/transaction.actions";

const Checkout = ({
  plan,
  amount,
  userId,
}: {
  plan: string;
  amount: number;
  userId: string;
}) => {
  loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  const onCheckout = async () => {
    const transaction = {
      plan,
      amount,
      buyerId: userId,
    };

    await checkoutOrder(transaction);
  };

  return (
    <form action={onCheckout} method="POST">
      <section>
        <Button
          type="button"
          role="link"
          className="w-full rounded-full bg-purple-gradient bg-cover"
        >
          Buy Credit
        </Button>
      </section>
    </form>
  );
};

export default Checkout;