// download the original video
// start the transcoder
// upload the video

const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs").promises;
const fsOld = require("fs"); 
const path = require("path");

const ffmpeg = require('fluent-ffmpeg');

console.log("Starting HLS transcoding...");

console.log('AWS KEY', process.env.AWS_ACCESS_KEY_ID);
console.log('AWS SEC', process.env.AWS_SECRET_ACCESS_KEY);

 
// todo maybe thru env variables
const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// env

console.log('BUCKET', process.env.BUCKET_NAME);
console.log('KEY', process.env.KEY);
console.log('MOVIE_SLUG', process.env.MOVIE_SLUG);

const BUCKET_NAME = process.env.BUCKET_NAME
const KEY = process.env.KEY
const MOVIE_SLUG = process.env.MOVIE_SLUG; // e.g., "interstellar-2014"

async function init() {
    // Download the original video
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: KEY,
    });

    const result = await s3Client.send(command);

    const originalFilePath = `videos/original-video.mp4`;
    await fs.mkdir('videos', { recursive: true });

    await fs.writeFile(originalFilePath, result.Body);

    const orginalVideoPath = path.resolve(originalFilePath);

    const outputDir = path.resolve("transcoded");
    await fs.mkdir(outputDir, { recursive: true });

    const variants = [
        { name: "360p", width: 640, height: 360, bandwidth: 800000 },
        { name: "480p", width: 854, height: 480, bandwidth: 1400000 },
        { name: "720p", width: 1280, height: 720, bandwidth: 2800000 },
        { name: "1080p", width: 1920, height: 1080, bandwidth: 5000000 },
        // { name: "2160p", width: 3840, height: 2160, bandwidth: 12000000 },
    ];

    await Promise.all(
        variants.map(async (variant) => {
            const variantDir = path.join(outputDir, variant.name);
            await fs.mkdir(variantDir, { recursive: true });

            return new Promise((resolve, reject) => {
                ffmpeg(orginalVideoPath)
                    .size(`${variant.width}x${variant.height}`)
                    .videoCodec('libx264')
                    .audioCodec('aac')
                    .outputOptions([
                        '-profile:v baseline',
                        '-level 3.0',
                        '-start_number 0',
                        '-hls_time 10',
                        '-hls_list_size 0',
                        '-f hls',
                        // '-threads 2' // Uncomment if you want to manually limit CPU threads per process
                    ])
                    .output(path.join(variantDir, "index.m3u8"))
                    .on('end', () => {
                        console.log(`✅ Finished: ${variant.name}`);
                        resolve();
                    })
                    .on('error', reject)
                    .run();
            });
        })
    );

    // Create master playlist
    let masterPlaylist = "#EXTM3U\n";
    for (const variant of variants) {
        masterPlaylist += `#EXT-X-STREAM-INF:BANDWIDTH=${variant.bandwidth},RESOLUTION=${variant.width}x${variant.height}\n`;
        masterPlaylist += `${variant.name}/index.m3u8\n`;
    }

    const masterPath = path.join(outputDir, "index.m3u8");
    await fs.writeFile(masterPath, masterPlaylist);

    // Upload all files
    const uploadDir = async (dirPath, s3Prefix) => {
        const files = await fs.readdir(dirPath, { withFileTypes: true });
        for (const file of files) {
            const filePath = path.join(dirPath, file.name);
            const key = path.join(s3Prefix, file.name);
            if (file.isDirectory()) {
                await uploadDir(filePath, key);
            } else {
                const putCommand = new PutObjectCommand({
                    Bucket: 'production.smarthverma.xyz',
                    Key: `hls/${MOVIE_SLUG}/${key}`,
                    Body: fsOld.createReadStream(filePath),
                });
                await s3Client.send(putCommand);
                console.log(`Uploaded ${key}`);
            }
        }
    };

    await uploadDir(outputDir, "");
}

init()
