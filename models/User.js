import { Schema, model } from "mongoose";

import { handleSaveError, addUpdateSettings } from "./hooks.js";

import Joi from "joi";

// const emailRegexp = /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\. [a-zA-Z]{2,4}$/;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      // match: emailRegexp,
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
      // minlength: 6,
      // for type: Number
      // min or max
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    avatarURL: String,
    token: {
      type: String,
    },
  },
  { versionKey: false, timestamps: true },
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

//////REGISTER///////
export const userSignupSchema = Joi.object({
  email: Joi.string().required(),
  //для використання регулярного виразу
  // email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
  //для того щоб задати максимальну кількість символів
  // password: Joi.string().min(6).required(),
  subscription: Joi.string()
    .valid("starter", "pro", "business")
    .default("starter"),
});

//////LOGIN///////
export const userSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

//SUBSCRIPTION UPDATING//
export const userUpdateSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...["starter", "pro", "business"])
    .required()
    .messages({ "any.required": "missing field subscription" }),
});

const User = model("user", userSchema);

export default User;
