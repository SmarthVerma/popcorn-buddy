import mutler from "multer";
import path from "path";

const storage = mutler.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});
const upload = mutler({ storage });

export default upload;
