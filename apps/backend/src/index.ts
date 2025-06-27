import express from "express";
import uploadRoutes from "./routes/upload.routes";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});

const uploadPath = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the smarth API!");
});

app.use("/api/upload", uploadRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
