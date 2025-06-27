import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getMovieUrl = async (Key: string) => {
  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  return signedUrl;
};

export const getMovieUploadUrl = async (title: string) => {
  if (!title) throw new Error("Title is required");

  const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  const key = `${title}/${movieSlug(title)}`;

  // SINCE no ContentType is provided, we assume the frontend will handle the file type
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ACL: "public-read",
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { uploadUrl };
};

export const getThumbnailUrl = (Key: string) => {
  return `http://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Key}`;
};

export const movieSlug = (title: string, ext?: string) => {
  if (!title) return "";

  const slug = title
    .toLowerCase()
    .normalize("NFKD") // Handles accents/diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .replace(/-+/g, "-"); // Collapse multiple hyphens

  return ext ? `${slug}.${ext}` : slug;
};

export const thumbnailSlug = (title: string) => {
  if (!title) return "";

  return (
    title
      .toLowerCase()
      .normalize("NFKD") // Handles accents/diacritics
      .replace(/[\u0300-\u036f]/g, "") // Remove accent marks
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with hyphen
      .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
      .replace(/-+/g, "-") + ".jpg"
  ); // Collapse multiple hyphens and add .jpg extension
};
