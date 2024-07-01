# Utiliser une image officielle de Node.js comme image de base
FROM node:20

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier package.json et yarn.lock dans le répertoire de travail
COPY package.json yarn.lock ./

# Installer les dépendances (incluant les dépendances de développement)
RUN yarn install

# Copier tout le contenu du répertoire actuel dans le répertoire de travail du conteneur
COPY . .

# Exposer le port que l'application utilise
EXPOSE 5000

# Définir la commande par défaut pour exécuter l'application
CMD ["yarn", "start"]
