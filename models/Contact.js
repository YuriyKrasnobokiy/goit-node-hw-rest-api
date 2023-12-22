import { Schema, model } from "mongoose";

import { handleSaveError } from "./hooks.js";

import Joi from "joi";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false },
);

// Якщо потрібно встановити код помилки
contactSchema.post("save", handleSaveError);

const requiredMessage = (field) => `missing required ${field} field`;

export const contactAddSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "any.required": requiredMessage("name"),
    }),
  email: Joi.string()
    .required()
    .messages({
      "any.required": requiredMessage("email"),
    }),
  phone: Joi.string()
    .required()
    .messages({
      "any.required": requiredMessage("phone"),
    }),
  favorite: Joi.boolean()
    .default(false)
    .required()
    .messages({
      "any.required": requiredMessage("favorite"),
    }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const Contact = model("contact", contactSchema);

export default Contact;
