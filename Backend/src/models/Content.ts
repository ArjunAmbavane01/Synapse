import { Schema, model } from "mongoose";
import User from "./User";

const contentTypes = ["image", "video", "blog", "audio"];

const contentSchema = new Schema({
  link: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: contentTypes,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  tags: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  userId: {
    type: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      validate: async (value: any) => {
        const user = await User.findById(value);
        if (!user) {
          throw new Error("User does not exist!");
        }
      },
    },
  },
});

const Content = model("content", contentSchema);

export default Content;
