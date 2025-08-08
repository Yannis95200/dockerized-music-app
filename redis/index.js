// index.js (ESM)
import express from 'express';
import session from 'express-session';
import { createClient } from 'redis';
import RedisStore from 'connect-redis';
import redisRoutes from './routes/redisRoutes.js';

// 1) Redis client
const redisClient = createClient({ url: 'redis://localhost:6379' });

// Gestion des erreurs Redis
redisClient.on('error', (err) => {
  console.error('Erreur Redis :', err);
});

try {
  await redisClient.connect();
  console.log('Connecté à Redis avec succès');
} catch (err) {
  console.error(' Impossible de se connecter à Redis :', err);
  process.exit(1);
}

// 2) Store de sessions
const store = new RedisStore({ client: redisClient });

const app = express();
app.use(express.json());

// 3) Session middleware
app.use(session({
  store,
  secret: 'change-moi-en-prod',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 15 } // 15 min
}));

// Routes Redis
app.use('/redis', redisRoutes);



app.listen(5000, () => console.log('Serveur sur http://localhost:5000'));
