import { Schema, model } from "mongoose";

const tagSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

const Tag = model("tag", tagSchema);

export default Tag;
