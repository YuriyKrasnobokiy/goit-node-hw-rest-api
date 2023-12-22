// import * as contactsService from "../models/index.js";

import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema } from "../models/Contact.js";

import { contactUpdateSchema } from "../models/Contact.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const result = await Contact.find();

  res.json(result);
};

// const getById = async (req, res) => {
//   const { id } = req.params;

//   const result = await contactsService.getContactById(id);

//   if (!result) {
//     throw HttpError(404, `Not found`);
//   }
//   res.json(result);
// };

const add = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

// const updateById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contactsService.updateContactById(id, req.body);
//   if (!result) {
//     throw HttpError(404, `Not found`);
//   }
//   res.json(result);
// };

// const deleteById = async (req, res) => {
//   const { id } = req.params;
//   const result = await contactsService.removeContact(id);
//   if (!result) {
//     throw HttpError(404, `Not found`);
//   }
//   res.json({
//     message: "Contact deleted",
//   });
//   // якщо потрібно передати 204 статус (немає контенту)
//   // res.status(204).send();
// };

export default {
  getAll: ctrlWrapper(getAll),
  // getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  // updateById: ctrlWrapper(updateById),
  // deleteById: ctrlWrapper(deleteById),
};
