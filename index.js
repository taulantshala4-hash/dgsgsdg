import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// multer setup (temporary filename)
const upload = multer({ dest: uploadDir });

// receive image from ESP32
app.post("/upload", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file");
  }

  const finalPath = path.join(uploadDir, "latest.jpg");
  fs.renameSync(req.file.path, finalPath);

  console.log("📸 Photo updated");
  res.status(200).send("OK");
});

// serve images
app.use("/images", express.static(uploadDir));

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
