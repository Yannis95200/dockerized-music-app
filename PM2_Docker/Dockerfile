# Image officielle Node.js
FROM node:20

# Dossier de travail
WORKDIR /app

# Copier package.json et installer les deps
COPY package*.json ./
RUN npm install

# Copier le reste du code
COPY . .

# Exposer le port
EXPOSE 5000

# Commande pour démarrer
CMD ["npm", "start"]
