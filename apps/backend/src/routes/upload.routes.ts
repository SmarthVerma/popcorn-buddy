import { Router } from "express";
import upload from "../middleware/mutler";
import { uploadMovie } from "../controllers/upload.controller";

const router: Router = Router();

// mutler for one video and one image
// This will handle multipart/form-data requests with fields "file" and "image"

const uploadHandler = upload.fields([
  { name: "movie", maxCount: 1 }, // For video file
  { name: "thumbnail", maxCount: 1 }, // For image file
]);

router.post("/movie", uploadHandler, uploadMovie);

export default router;
