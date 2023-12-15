import * as contactsService from "../models/index.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema } from "../schemas/contact-schemas.js";
import { contactUpdateSchema } from "../schemas/contact-schemas.js";

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
      throw HttpError(404, `Not found`);
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

const updateById = async (req, res, next) => {
  try {
    const { error } = contactUpdateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id } = req.params;
    const result = await contactsService.updateContactById(id, req.body);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    res.json({
      message: "Contact deleted",
    });
    // якщо потрібно передати 204 статус (немає контенту)
    // res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getById,
  add,
  updateById,
  deleteById,
};
