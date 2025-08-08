// routes/redisRoutes.js
import express from 'express';
import redisClient from '../redis.js';

const router = express.Router();

// Compteur de sessions
router.get('/', (req, res) => {
  req.session.count = (req.session.count || 0) + 1;
  res.send(`Compteur: ${req.session.count}`);
});

// Cache posts
router.get('/posts', async (req, res) => {
  const cached = await redisClient.get('posts');
  if (cached) {
    console.log(" Données récupérées depuis Redis");
    return res.json(JSON.parse(cached));
  }

  const posts = [{ id: 1, title: "Hello" }, { id: 2, title: "Redis Rocks" }];
  await redisClient.setEx('posts', 60, JSON.stringify(posts));

  console.log("Données stockées dans Redis");
  res.json(posts);
});

// Simulation lente
router.get('/slow-data', async (req, res) => {
  const cachedData = await redisClient.get('slowData');
  if (cachedData) {
    console.log(" Donnée récupérée depuis Redis");
    return res.json(JSON.parse(cachedData));
  }

  console.log("Lecture lente...");
  await new Promise(resolve => setTimeout(resolve, 3000));

  const data = { time: new Date(), message: "Ceci est une donnée lente simulée" };
  await redisClient.setEx('slowData', 30, JSON.stringify(data));

  console.log(" Donnée sauvegardée dans Redis");
  res.json(data);
});


router.get('/visites', async (req, res) => {
  try {
    //  Incrémenter la clé "visites:homepage"
    const total = await redisClient.incr('visites:homepage');

    //  Retourner le nombre total
    res.json({ totalVisites: total });
  } catch (err) {
    console.error("Erreur compteur :", err);
    res.status(500).json({ error: "Impossible de récupérer le compteur" });
  }
});

// Génération token
router.get('/generate-token/:userId', async (req, res) => {
  const { userId } = req.params;
  await redisClient.setEx(`token:${userId}`, 300, "ABC123");
  res.json({ status: "token créé" });
});

// Lecture token
router.get('/check-token/:userId', async (req, res) => {
  const { userId } = req.params;
  const token = await redisClient.get(`token:${userId}`);
  res.json({ token });
});

// Compteur de visites
router.get('/visites', async (req, res) => {
  const total = await redisClient.incr('visites:homepage');
  res.json({ visites: total });
});

export default router;
