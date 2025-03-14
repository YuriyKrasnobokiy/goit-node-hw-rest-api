import { isValidObjectId } from "mongoose";

import { HttpError } from "../helpers/index.js";

const isVAlidId = (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`));
  }
  next();
};

export default isVAlidId;
