import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { client } from "@repo/db/client";
import fs from "fs";
import { getThumbnailUrl, movieSlug } from "../helpers/awsHelpers";
import asyncHandler from "../utils/asynchandler";


export const uploadMovie = asyncHandler(async (req: any, res: any) => {
  const { title, genre, platform } = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  if (!req.files || !files.movie || !files.thumbnail) {
    return res
      .status(400)
      .json({ error: "Please upload both video and image files." });
  }

  if (!title || genre.length === 0 || platform.length === 0) {
    return res
      .status(400)
      .json({ error: "Title, genre, and platform are required." });
  }
  // Access the uploaded files

  const thumbnailPath = files.thumbnail[0]?.path!;


  const fileExtension = files.thumbnail[0]?.mimetype?.split("/")[1] || "jpg";

  const key = `${title}/${movieSlug(title, fileExtension)}`;


  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: fs.createReadStream(thumbnailPath),
    ContentType: files.thumbnail[0]?.mimetype,
    ACL: "public-read", // Make the file publicly readable
  });

  const thumbnailUrl = getThumbnailUrl(`${title}/${movieSlug(title, fileExtension)}`);

  const response = await s3Client.send(putCommand);

  const movieData = await client.movie.create({
    data: {
      title,
      platform, // platform should be array of enum strings
      genre, // genre should be array of enum strings
      thumbnail: thumbnailUrl,
      key: `${title}/${movieSlug(title)}`,
    },
  });

  res.status(201).json({
    message: "Movie uploaded successfully",
    movie: {
      id: movieData.id,
      title: movieData.title,
      platform: movieData.platform,
      genre: movieData.genre,
      thumbnail: movieData.thumbnail,
      key: movieData.key,
    },
  })
});
