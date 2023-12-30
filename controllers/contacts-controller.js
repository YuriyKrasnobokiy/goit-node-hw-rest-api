// import * as contactsService from "../models/index.js";

import Contact from "../models/Contact.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  //!!! метод populate щоб повернути не id власника, а об'єкт власника з id та усією інфою populate("owner") або конкретне поле
  // const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
  //   skip,
  //   limit,
  // }).populate("owner", "email");

  //!!! щоб отримати певні поля
  // const result = await Contact.find({}, "phone name");

  //!!! щоб отримати без певних полів
  // const result = await Contact.find({}, "-phone -favorite");

  res.json(result);
};

const getById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;

  const result = await Contact.findOne({ _id, owner });

  //або без перевірки власника

  // const result = await Contact.findById(id);

  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndUpdate({ _id, owner }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json(result);
};

const deleteById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await Contact.findOneAndDelete({ _id, owner });
  if (!result) {
    throw HttpError(404, `Not found`);
  }
  res.json({
    message: "Contact deleted",
  });
  // якщо потрібно передати 204 статус (немає контенту)
  // res.status(204).send();
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteById: ctrlWrapper(deleteById),
};
