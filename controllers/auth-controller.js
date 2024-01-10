import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import jwt from "jsonwebtoken";

dotenv.config();

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");

//////REGISTER///////
const signup = async (req, res) => {
  const { email, password } = req.body;

  const { path: oldPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);

  const avatar = path.join("avatars", filename);

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    avatarURL: avatar,
    password: hashPassword,
  });

  res.json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: avatar,
    },
  });
};

//////LOGIN///////
const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await User.findByIdAndUpdate(id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

//CURRENT//
const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;

  res.json({
    email,
    subscription,
  });
};

//LOGOUT//
const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  // res.json({
  //   message: "Signout success",
  // });
  res.status(204).send();
};

//subscription updating//

const subscrUpdate = async (req, res) => {
  const { _id } = req.user;
  const result = await User.findOneAndUpdate(_id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(result);
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  subscrUpdate: ctrlWrapper(subscrUpdate),
};
