import path from "path";
import express, { Router } from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const __dirname = path.resolve();
const UPLOAD_DIR = path.join(__dirname, "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const minetypes = /image\/jpe?g|image\/png||image\/webp/;

  const extname = path.extname(file.originalname);
  const minetype = file.minetype;

  if (filetypes.test(extname) && minetypes.test(minetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file profided" });
    }
  });
});

// Endpoint to delete a file
router.delete("/delete-file/:fileName", (req, res) => {
  const { fileName } = req.params;

  // Path to the file to be deleted
  const filePath = path.join(UPLOAD_DIR, fileName);

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // File does not exist
      return res.status(404).json({ message: "File not found" });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        // Error while deleting the file
        return res.status(500).json({ message: "Error deleting the file" });
      }

      // Successfully deleted the file
      return res.json({ message: "File deleted successfully" });
    });
  });
});

export default router;
