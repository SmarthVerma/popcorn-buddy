import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { client } from "@repo/db/client";
import fs from "fs";
import {
  getMovieUploadUrl,
  getThumbnailUrl,
  movieSlug,
} from "../helpers/awsHelpers";
import asyncHandler from "../utils/controller-utils/asynchandler";
import ApiResponse from "../utils/controller-utils/ApiResponse";
import ApiError from "../utils/controller-utils/ApiError";

export const uploadMovieMetadata = asyncHandler(async (req: any, res: any) => {
  const { title, genre, platform, extension, contentType } = req.body;
  const file = req.file as Express.Multer.File;

  if (!req.file) {
    return new ApiError(400, "Please upload asd thumbnail.").send(res);
  }

  if (!title || genre.length === 0 || platform.length === 0) {
    return new ApiError(400, "Title, genre, and platform are required.").send(
      res
    );
  }

  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  // Access the uploaded

  const thumbnailPath = file.path;
  const fileExtension = file.mimetype?.split("/")[1] || "jpg";

  const key = `${title}/${movieSlug(title, fileExtension)}`; // raider2.jpg

  const putCommand = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: fs.createReadStream(thumbnailPath),
    ContentType: file?.mimetype,
    ACL: "public-read", // Make the file publicly readable
  });

  const thumbnailUrl = getThumbnailUrl(
    `${title}/${movieSlug(title, fileExtension)}`
  );

  // WIP: From frontend we will get platform and genre as arrays of strings
  const platformArray = Array.isArray(platform) ? platform : [platform];
  const genreArray = Array.isArray(genre) ? genre : [genre];

  // GET: movieUploadUrl
  const uploadUrl = await getMovieUploadUrl(title, extension, contentType);

  const response = await s3Client.send(putCommand);

  if (
    !response.$metadata.httpStatusCode ||
    response.$metadata.httpStatusCode !== 200
  ) {
    return new ApiError(400, "Failed to upload thumbnail to S3").send(res);
  }

  await client.movie.create({
    data: {
      title,
      platform: platformArray, // platform should be array of enum strings
      genre: genreArray, // genre should be array of enum strings
      thumbnail: thumbnailUrl,
      key: `${title}/${movieSlug(title)}`,
    },
  });

  return new ApiResponse(201, uploadUrl, "New movie update url created").send(
    res
  );
});
