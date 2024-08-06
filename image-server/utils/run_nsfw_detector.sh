#!/bin/bash

# Chemin vers l'environnement virtuel
VENV_PATH="./venv"

# Vérifiez si l'environnement virtuel existe
if [ ! -d "$VENV_PATH" ]; then
  echo "L'environnement virtuel n'existe pas. Veuillez le créer d'abord."
  exit 1
fi

# Activer l'environnement virtuel
source "$VENV_PATH/bin/activate"

# Exécuter le script Python
python3 utils/nsfw_detector.py "$1"

# Désactiver l'environnement virtuel
deactivate
