import { Router, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { z } from "zod";

import User from "../models/User";
import { JWT_SECRET } from "../config";

const userRouter = Router();

const signupBodySchema = z.object({
  username: z
    .string()
    .min(3, "Username should be more than 3 characters")
    .max(10, "Username cannot be more than 10 characters"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password must not exceed 20 characters")
    .regex(/[A-Z]/, "Password must have at least one uppercase letter")
    .regex(/[a-z]/, "Password must have at least one lowercase letter")
    .regex(/[0-9]/, "Password must have at least one number")
    .regex(/[@$!%*?&#]/, "Password must have at least one special character"),
});

const signinSchema = z.object({
  username: z.string().min(3, "Invalid username format"),
  password: z.string().min(8, "Invalid password format"),
});

userRouter.post("/signup", async (req: Request, res: Response) => {
  const validation = signupBodySchema.safeParse(req.body);
  if (!validation.success) {
    res.status(411).json({
      message: "Validation error",
      errors: validation.error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      })),
    });
    return;
  }

  const { username, password } = validation.data;
  try {
    const isUser = await User.findOne({ username });
    if (isUser) {
      res.status(403).json({
        message: "User already exists with this username",
      });
      return;
    }
    const hashPassword = await hash(password, 5);
    await User.create({
      username,
      password: hashPassword,
    });

    res.status(200).json({
      message: "Signup Successful",
    });
  } catch (e) {
    console.log("Some error occurred : ", e instanceof Error ? e.message : e);
    res.status(500).json({
      message: "Server error",
    });
  }
});

userRouter.post("/signin", async (req: Request, res: Response) => {
  const validation = signinSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(411).json({
      message: "Validation error",
      errors: validation.error.errors.map((err) => ({
        path: err.path,
        message: err.message,
      })),
    });
    return;
  }

  const { username, password } = validation.data;
  try {
    const user = await User.findOne({ username });
    if (user) {
      const passwordResult = await compare(password, user.password);
      if (passwordResult) {
        res.status(200).json({
          token: sign({ userId: user._id }, JWT_SECRET),
        });
      }
    } else {
      res.status(403).json({
        message: "Username does not exist",
      });
    }
  } catch (e) {
    console.log("Some error occurred : ", e instanceof Error ? e.message : e);
    res.status(500).json({
      message: "Server error",
    });
  }
});

export default userRouter;
