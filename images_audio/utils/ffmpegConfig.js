import ffmpeg from 'fluent-ffmpeg';

app.post('/audio/preview', upload.single('audio'), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const outDir = 'processed';
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = `${outDir}/${path.basename(inputPath, path.extname(inputPath))}_preview.mp3`;

    ffmpeg(inputPath)
      .setStartTime('0')
      .setDuration(30)                 // preview 30s
      .audioBitrate('128k')           // bitrate constant
      .toFormat('mp3')
      .on('end', () => res.json({ preview: outPath }))
      .on('error', (err) => {
        console.error(err);
        res.status(500).json({ error: 'FFmpeg conversion failed' });
      })
      .save(outPath);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Preview failed' });
  }
});
