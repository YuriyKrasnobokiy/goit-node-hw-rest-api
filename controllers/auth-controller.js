import User from "../models/User.js";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await User.create(req.body);

  res.json({
    email: newUser.email,
    password: newUser.password,
  });
};

export default {
  signup: ctrlWrapper(signup),
};
