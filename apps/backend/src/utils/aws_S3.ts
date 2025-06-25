import { S3Client } from "@aws-sdk/client-s3";




export const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;
export const BUCKET_RAW_VIDEO = process.env.AWS_S3_RAW_VIDEOS_FOLDER!;
