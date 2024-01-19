import User from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { HttpError, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

dotenv.config();

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsPath = path.resolve("public", "avatars");

//////REGISTER///////
const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = nanoid();

  const avaURL = gravatar.url(email);

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    verificationToken,
    avatarURL: avaURL,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a
        target="_blank"
        href="${BASE_URL}/api/users/verify/${verificationToken}"
      >Click to verification your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

////VERIFY////
const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found or already verify");
  }
  await User.findByIdAndUpdate(user.id, {
    verify: true,
    verificationToken: "",
  });

  res.json({
    message: "Verification successful",
  });
};

////RESEND VERIFY////
const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a
        target="_blank"
        href="${BASE_URL}/api/users/verify/${user.verificationToken}"
      >Click to verification your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
};

//////LOGIN///////
const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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

//updating avatar//

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: oldPath, filename } = req.file;

  const newPath = path.join(avatarsPath, filename);

  await fs.rename(oldPath, newPath);

  //////change width and hight for image

  Jimp.read(newPath)
    .then((img) => {
      return img
        .resize(250, 250) // resize
        .write(newPath); // save
    })
    .catch((err) => {
      console.error(err);
    });

  ////

  const avatarURL = path.join("avatars", filename);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  subscrUpdate: ctrlWrapper(subscrUpdate),
  updateAvatar: ctrlWrapper(updateAvatar),
};
