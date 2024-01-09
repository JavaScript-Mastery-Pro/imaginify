"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import Transaction from "../database/models/transaction.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CHECKOUT
export async function checkoutOrder(transaction: CheckoutTransactionParams) {
  console.log("transaction", transaction, process.env.STRIPE_SECRET_KEY);

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const amount = Number(transaction.amount) * 100;

  /**
   * Create a new checkout session
   * https://stripe.com/docs/api/checkout/sessions/create
   * https://stripe.com/docs/payments/checkout/accept-a-payment#create-checkout-session
   */
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: amount,
          product_data: {
            name: transaction.plan,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      plan: transaction.plan,
      buyerId: transaction.buyerId,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
  });

  redirect(session.url!);
}

// CREATE
export async function createTransaction(transaction: CreateTransactionParams) {
  try {
    await connectToDatabase();

    // Create new transaction with buyer id
    const newTransaction = await Transaction.create({
      ...transaction,
      buyer: transaction.buyerId,
    });

    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
