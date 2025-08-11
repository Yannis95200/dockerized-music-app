#  Gestion de cache et sessions avec Redis (Node.js + Express)

Ce module montre comment utiliser **Redis** avec un serveur **Express.js** pour :
- Stocker les sessions
- Mettre en cache des données
- Gérer des compteurs
- Améliorer les performances d'une API

---

## Technologies utilisées
- **Node.js / Express.js**
- **Redis** (via Docker ou local)
- **redis** (client Node)
- **connect-redis** (sessions Express)
- **express-session**

---

## Installation

### 1. Lancer Redis avec Docker
```bash
docker run -d -p 6379:6379 --name redis redis
