// download the original video
// start the transcoder
// upload the video

const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs").promises;
const fsOld = require("node:fs/promises");
const path = require("path");

const ffmpeg = require('fluent-ffmpeg');

const RESOLUTIONS = [
    { name: "360p", width: 480, height: 360 },
    { name: "480p", width: 858, height: 480 },
    { name: "720p", width: 1280, height: 720 },
];

// todo maybe thru env variables
const s3Client = new S3Client({
    region: "",
    credentials: {
        accessKeyId: "",
        secretAccessKey: "+",
    },
});

// env
const BUCKET_NAME = process.env.BUCKET_NAME
const KEY = process.env.KEY

async function init() {
    // Download the original video
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: KEY,
    });

    const result = await s3Client.send(command);

    const originalFilePath = `videos/original-video.mp4`;

    await fs.writeFile(originalFilePath, result.Body);

    const orginalVideoPath = path.resolve(originalFilePath);

    const outputDir = path.resolve("transcoded");
    await fs.mkdir(outputDir, { recursive: true });

    await new Promise((resolve, reject) => {
        ffmpeg(orginalVideoPath)
            .addOptions([
                '-profile:v baseline', // H.264 baseline profile for compatibility
                '-level 3.0',
                '-start_number 0',
                '-hls_time 10',        // 10-second segments
                '-hls_list_size 0',    // no limit on playlist size
                '-f hls'
            ])
            .output(path.join(outputDir, "index.m3u8"))
            .on("start", () => console.log("HLS Transcoding started"))
            .on("end", async () => {
                const files = await fs.readdir(outputDir);
                for (const file of files) {
                    const filePath = path.join(outputDir, file);
                    const putCommand = new PutObjectCommand({
                        Bucket: 'production.smarthverma.xyz',
                        Key: `hls/${file}`,
                        Body: fsOld.createReadStream(filePath),
                    });
                    await s3Client.send(putCommand);
                    console.log(`Uploaded ${file}`);
                }
                resolve();
            })
            .on('error', reject)
            .run();
    });
}

init()
