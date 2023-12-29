import User from "../models/User.js";

import bcrypt from "bcrypt";

import { HttpError } from "../helpers/index.js";

import { ctrlWrapper } from "../decorators/index.js";

const signup = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signin = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const token = "124.5333.533";

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};
