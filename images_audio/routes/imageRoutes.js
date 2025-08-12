import express from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outDir = 'processed';
    const sizes = [320, 640, 1280];
    const outputs = [];

    for (const w of sizes) {
      const out = `${outDir}/${path.basename(inputPath, path.extname(inputPath))}_${w}.webp`;
      await sharp(inputPath)
        .resize({ width: w })
        .webp({ quality: 80 })
        .toFile(out);
      outputs.push({ width: w, path: out });
    }

    res.json({
      original: {
        filename: req.file.filename,
        mime: mime.lookup(req.file.originalname),
      },
      variants: outputs
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

export default router;
