import express from "express";
import uploadRoutes from "./routes/upload.routes";
import fs from "fs";
import path from "path";

const uploadPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Backend API!");
});

app.use("/api/upload", uploadRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
