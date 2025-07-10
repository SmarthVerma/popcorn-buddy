import WebTorrent from 'webtorrent';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'; import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new WebTorrent();

const torrentFileOrMagnet = 'https://en.yts-official.mx/torrent/Dark%20City%20(1998)%20720p.BluRay.torrent'; // Can be .torrent file path, URL, or Magnet Link

client.add(torrentFileOrMagnet, { path: path.join(__dirname, 'downloads') }, (torrent) => {
    console.log(`Started downloading: ${torrent.name}`);

    const interval = setInterval(() => {
        console.log(`Progress: ${(torrent.progress * 100).toFixed(2)}%`);
    }, 1000);

    torrent.on('done', async () => {
        clearInterval(interval);
        console.log('Download finished');
        console.log(`Downloaded to: ${path.join(__dirname, 'downloads', torrent.name)}`);

        console.log('Uploading to S3 temp bucket')
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });

        const downloadedDir = path.join(__dirname, 'downloads', torrent.name);
        const files = fs.readdirSync(downloadedDir); // List files in the folder
        
        if (files.length === 0) {
            console.error('No files found in the downloaded folder.');
            return;
        }
        
        const firstFile = files[0]; // You can loop or select specific file based on your needs
        
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `torrents/${firstFile}`,
            Body: fs.createReadStream(path.join(downloadedDir, firstFile)),
        });


        try {
            await s3Client.send(command);
            console.log('Upload successful');
        } catch (err) {
            console.error('Upload error:', err);
        }

        client.destroy(); // Close client after download
    });

    torrent.on('error', (err) => {
        console.error('Torrent error:', err);
    });
});