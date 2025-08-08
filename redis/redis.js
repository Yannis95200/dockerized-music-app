import { createClient } from "redis";

const redisClient = createClient();

// Gestion des erreurs
redisClient.on('error', (err) => console.error('Erreur Redis :', err));

async function initRedis() {
  try {
    // Connexion
    await redisClient.connect();
    console.log("Redis connecté");

    // Test d'écriture
    await redisClient.set('yannis:test', ' Redis fonctionne !');

    // Test de lecture
    const value = await redisClient.get('yannis:test');
    console.log(' Valeur test récupérée depuis Redis :', value);

  } catch (err) {
    console.error("Erreur initialisation Redis :", err);
  }
}

// Lance le test de connexion au démarrage
initRedis();

export default redisClient;
