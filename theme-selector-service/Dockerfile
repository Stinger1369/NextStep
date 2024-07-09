# Utiliser une image officielle de Python comme image de base
FROM python:3.9-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier requirements.txt dans le répertoire de travail
COPY requirements.txt .

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier tout le contenu du répertoire actuel dans le répertoire de travail du conteneur
COPY . .

# Exposer le port que l'application Flask utilise
EXPOSE 8001

# Définir la commande par défaut pour exécuter l'application Flask
CMD ["python", "app.py"]
