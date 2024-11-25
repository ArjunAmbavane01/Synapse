import { Schema, model } from "mongoose";

const linkSchema = new Schema({
  hash: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Link = model("link", linkSchema);

export default Link;
