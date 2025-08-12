import express from 'express';
import fs from 'fs';
import path from 'path';
import imageRoutes from './routes/imageRoutes.js';
import audioRoutes from './routes/audioRoutes.js';

const app = express();
const PORT = 5000;

// Crée les dossiers si manquants
fs.mkdirSync('uploads', { recursive: true });
fs.mkdirSync('processed', { recursive: true });

// Middleware JSON
app.use(express.json());
app.use('/image', (req, res, next) => {
  console.log('➡️  /image hit', req.method, req.url);
  next();
}, imageRoutes);

// Routes
app.use('/image', imageRoutes);
app.use('/audio', audioRoutes);
app.use('/static', express.static('processed'));

// Lancer serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

