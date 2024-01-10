import { Schema, model, models, Document } from "mongoose";

export interface IOrder extends Document {
  _id: String;
  createdAt: Date;
  stripeId: string;
  amount: string;
  plan: string;
  buyer: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

const TransactionSchema = new Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Transaction =
  models?.Transaction || model("Transaction", TransactionSchema);

export default Transaction;
