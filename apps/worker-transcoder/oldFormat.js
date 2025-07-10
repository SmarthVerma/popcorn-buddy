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
        secretAccessKey: "",
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

    const promises = RESOLUTIONS.map(resolution => {
        const output = `transcoded/video-/${resolution.name}.mp4`;

        return new Promise((resolve) => {
            ffmpeg(orginalVideoPath)
                .output(output)
                .withVideoCodec('libx264')
                .withAudioCodec('aac')
                .withSize(`${resolution.width}x${resolution.height}`)
                .on("start", () => console.log("Start", `${resolution.width}x${resolution.height}`))
                .on('end', async () => {
                    const putCommand = new PutObjectCommand({
                        Bucket: 'production.smarthverma.xyz',
                        Key: output,
                        Body: fsOld.createReadStream(path.resolve(output))
                    });
                    await s3Client.send(putCommand);
                    console.log(`Uploaded ${output}`,)
                    resolve(output);
                })
                .format('mp4')
                .run(); 
        })
    })

    await Promise.all(promises);
}

init()
