import { Schema, model } from "mongoose";

// import { handleSaveError } from "./hooks.js";

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
// contactSchema.post("save", handleSaveError);

const Contact = model("contact", contactSchema);

export default Contact;
