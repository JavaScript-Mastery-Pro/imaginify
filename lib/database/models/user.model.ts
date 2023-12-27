import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  planType: {
    type: String,
    required: true,
    default: "Free plan",
  },
  credits: {
    type: Number,
    default: 10,
  },
});

const User = models.User || model("User", UserSchema);

export default User;
