import Joi from "joi";

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
  phone: Joi.number()
    .required()
    .messages({
      "any.required": requiredMessage("phone"),
    }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.number(),
});
