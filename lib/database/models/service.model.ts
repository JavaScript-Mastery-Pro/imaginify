import { Schema, model, models, Document } from "mongoose";

export interface IService extends Document {
  _id: string;
  title: string;
  imageUrl: string;
  serviceType: string;
  aspectRatio: string;
  targetObject: string;
  prompt: string;
  transformedImageUrl: string;
  author: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  transformedImageUrl: {
    type: String,
  },
  serviceType: {
    type: String,
    required: true,
  },
  aspectRatio: {
    type: String,
  },
  targetObject: {
    type: String,
  },
  prompt: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Service = models.Service || model("Service", ServiceSchema);

export default Service;
