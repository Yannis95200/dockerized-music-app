import express from "express";
import multer from "multer";
import sharp from "sharp";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = 5000;

// Multer en mémoire (pas d'écritures disque)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /^image\/(jpeg|png|webp|avif)$/.test(file.mimetype);
    cb(ok ? null : new Error("Type d'image non supporté (jpeg/png/webp/avif)"));
  }
});

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});
const BUCKET = process.env.AWS_BUCKET_NAME;
const CDN = process.env.CLOUDFRONT_URL || "";

const uid = () => crypto.randomBytes(8).toString("hex");
const s3Url = (key) =>
  CDN ? `${CDN}/${key}` : `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

// Route test
app.get("/", (_req, res) => res.send("Sharp → S3 prêt 🚀"));
app.post("/_test-multer", upload.single("file"), (req, res) => {
  console.log("content-type:", req.headers["content-type"]);
  console.log("file:", req.file);
  if (!req.file) return res.status(400).json({ error: "Aucun fichier capté" });
  res.json({
    fieldname: req.file.fieldname,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
});
app.post("/debug-upload", upload.single("file"), (req, res) => {
  res.json({
    method: req.method,
    contentType: req.headers["content-type"],
    hasFile: !!req.file,
    file: req.file || null,
    bodyKeys: Object.keys(req.body || {})
  });
});

// POST /upload-image 
app.post("/upload-image", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Aucun fichier" });

    const input = req.file.buffer;

    const meta = await sharp(input).metadata();

    const sizes = [320, 640, 1280];

    const baseKey = `images/${Date.now()}_${uid()}`;
    const uploads = [];

    for (const w of sizes) {
      const outBuffer = await sharp(input)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();

      const key = `${baseKey}_${w}.webp`;
      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: outBuffer,
          ContentType: "image/webp",
          ACL: "public-read"
        })
      );

      uploads.push({
        width: w,
        format: "webp",
        key,
        url: s3Url(key),
        bytes: outBuffer.length
      });
    }

    

    const optimizedFull = await sharp(input).webp({ quality: 85 }).toBuffer();
    const fullKey = `${baseKey}_full.webp`;
    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: fullKey,
        Body: optimizedFull,
        ContentType: "image/webp",
        ACL: "public-read"
      })
    );

    res.json({
      original: {
        mime: req.file.mimetype,
        width: meta.width,
        height: meta.height,
        format: meta.format
      },
      full: { key: fullKey, url: s3Url(fullKey), bytes: optimizedFull.length },
      variants: uploads
    });
  } catch (err) {
    console.error(" Sharp/S3 error:", err);
    res.status(500).json({ error: "Image processing/upload failed" });
  }
});

app.listen(PORT, () => {
  console.log(` Serveur sur http://localhost:${PORT}`);
});
