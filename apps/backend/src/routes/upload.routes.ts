import { Router } from "express";
import upload from "../middleware/mutler";

const router: Router = Router();

// mutler for one video and one image
// This will handle multipart/form-data requests with fields "file" and "image"

const uploadHandler = upload.fields([
  { name: "file", maxCount: 1 }, // For video file
  { name: "image", maxCount: 1 }, // For image file
]);

router.post("/movie", uploadHandler, (req: any, res: any) => {
  // Check if files are uploaded
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  if (!req.files || !files.file || !files.image) {
    return res
      .status(400)
      .json({ error: "Please upload both video and image files." });
  }

  // Access the uploaded files
  const videoFile = files.file[0];
  const imageFile = files.image[0];

  // Respond with the file information
  res.json({
    message: "Files uploaded successfully",
    video: {
      filename: videoFile?.filename,
      size: videoFile?.size,
      mimetype: videoFile?.mimetype,
    },
    image: {
      filename: imageFile?.filename,
      size: imageFile?.size,
      mimetype: imageFile?.mimetype,
    },
  });
});

export default router;
