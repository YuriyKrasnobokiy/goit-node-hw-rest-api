import * as contactsService from "../models/index.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema } from "../schemas/contact-schemas.js";

const getAll = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
    //   res.status(500).json({
    //     message: error.message,
    //     // message: "Server error",
    //   });
    // }
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await contactsService.getContactById(id);

    if (!result) {
      throw HttpError(404, `Contact with id ${id} not found`);
      // const error = new Error(`Contact with id ${id} not found`);
      // error.status = 404;
      // throw error;
    }
    res.json(result);
  } catch (error) {
    next(error);
    // const { status = 500, message = "Server error" } = error;
    // res.status(500).json({
    //   message,
    // });
  }
};

const add = async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  add,
};
