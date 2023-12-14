import * as contactsService from "../models/index.js";

const getAll = async (req, res) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      // message: "Server error",
    });
  }
};

const getById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await contactsService.getContactById(id);

    if (!result) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
      // message: "Server error",
    });
  }
};

export default {
  getAll,
  getById,
};
