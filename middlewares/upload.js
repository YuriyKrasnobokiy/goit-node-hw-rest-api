import multer from "multer";
import path from "path";
import { HttpError } from "../helpers/index.js";

//абсолютний шлях до файлу
const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePreffix}_${file.originalname}`;
    callback(null, filename);
  },
});

//обмеження за розміром файлу//
const limits = {
  fileSize: 1024 * 1024 * 5,
};

//обмеження за роширенням файлу//
const fileFilter = (req, file, callback) => {
  const extention = req.originalname.split(".").pop();

  if (extention === "exe") {
    callback(HttpError(400, ".exe not valid extention"));
  }
};

const upload = multer({
  storage,
  limits,
  // fileFilter,
});

export default upload;
