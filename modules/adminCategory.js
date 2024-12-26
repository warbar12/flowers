import mongoose from "mongoose";

const AdminCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    order: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    listingImage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "AdminCategory",
  AdminCategorySchema,
  "adminCategory"
);
