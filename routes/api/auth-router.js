import express from "express";

import authController from "../../controllers/auth-controller.js";

import {
  authenticate,
  isEmptyBody,
  isValidId,
} from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import { userSignupSchema, userSigninSchema } from "../../models/User.js";

const authRouter = express.Router();

//////REGISTER///////
authRouter.post(
  // "/signup",
  "/register",
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.signup,
);

//////LOGIN///////
authRouter.post(
  // "/signin",
  "/login",
  isEmptyBody,
  validateBody(userSigninSchema),
  authController.signin,
);

////CURRENT////
authRouter.get("/current", authenticate, authController.getCurrent);

///LOGOUT///
// authRouter.post("/signout", authenticate, authController.signout)
authRouter.post("/logout", authenticate, authController.signout);

export default authRouter;
