import express from 'express';
import { parseFile } from 'music-metadata';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import upload from '../utils/multerConfig.js';

const router = express.Router();

// Lire métadonnées
router.post('/metadata', upload.single('audio'), async (req, res) => {
  try {
    const metadata = await parseFile(req.file.path);
    res.json({
      filename: req.file.filename,
      common: metadata.common,
      format: metadata.format
    });
  } catch (e) {
    res.status(500).json({ error: 'Audio metadata failed' });
  }
});

// Générer preview 30s
router.post('/preview', upload.single('audio'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outDir = 'processed';
    const outPath = `${outDir}/${path.basename(inputPath, path.extname(inputPath))}_preview.mp3`;

    ffmpeg(inputPath)
      .setStartTime('0')
      .setDuration(30)
      .audioBitrate('128k')
      .toFormat('mp3')
      .on('end', () => res.json({ preview: outPath }))
      .on('error', (err) => res.status(500).json({ error: err.message }))
      .save(outPath);
  } catch (e) {
    res.status(500).json({ error: 'Preview failed' });
  }
});

export default router;