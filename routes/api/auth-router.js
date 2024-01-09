import express from "express";

import authController from "../../controllers/auth-controller.js";

import {
  authenticate,
  isEmptyBody,
  isValidId,
  upload,
} from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import {
  userSignupSchema,
  userSigninSchema,
  userUpdateSubscription,
} from "../../models/User.js";

const authRouter = express.Router();

//////REGISTER///////
authRouter.post(
  // "/signup",
  "/register",
  upload.single("avatar"),
  //якщо приходить декілька файлів - метод array та к-ть файлів
  //upload.array("avatar", 8)
  //якщо в декількох полях приходять файли - fields
  //upload.fields([{name: "avatar", maxCount: 8}])
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

////UPDATING SUBSCRIPTION////
authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(userUpdateSubscription),
  authController.subscrUpdate,
);

export default authRouter;
