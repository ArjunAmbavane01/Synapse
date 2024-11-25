import { connect } from "mongoose";
import { MONGOURI } from "./config";

export const connectDB = async () => {
  try {
    await connect(MONGOURI);
    console.log("Connected to Database");
  } catch (e) {
    console.log(
      "Database connection failed : ",
      e instanceof Error ? e.message : e
    );
  }
};
