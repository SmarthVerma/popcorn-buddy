const uploadMovie = async (req, res) => {
  const {
    title,
    genre,
    platform,
  } = req.body;
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
};
