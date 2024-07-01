# Projet erlangChat

Ce projet contient une application de chat développée en Erlang, comprenant différents modules pour gérer le serveur, les clients, les notifications, les groupes de chat, etc.

## Structure du projet

- `src/`: Contient les fichiers source Erlang pour chaque module.
- `include/`: Fichiers de définition de macros et de types.
- `priv/`: Contient les fichiers de configuration et de base de données.
- `ebin/`: Emplacement où les fichiers `.beam` seront générés.
- `test/`: Tests unitaires et d'intégration pour chaque module.
- `rebar.config`: Fichier de configuration pour l'outil de build Rebar.

## Installation

Pour exécuter ce projet, assurez-vous d'avoir Erlang installé sur votre système. Utilisez Rebar pour compiler et exécuter les fichiers `.erl`.

## Usage

1. Clonez le projet : `git clone https://example.com/erlangChat.git`
2. Accédez au répertoire du projet : `cd erlangChat`
3. Compilez le projet : `rebar compile`
4. Exécutez le serveur de chat : `erl -pa ebin -s chat_server start`

## Contribuer

Les contributions au projet sont les bienvenues. Pour contribuer, veuillez suivre ces étapes :
1. Fork du projet.
2. Créez une nouvelle branche (`git checkout -b feature/ajout-nouvelle-fonctionnalite`).
3. Faites vos modifications et committez-les (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`).
4. Poussez la branche (`git push origin feature/ajout-nouvelle-fonctionnalite`).
5. Créez une pull request.

## Licence

Ce projet est sous licence MIT - voir le fichier LICENSE pour plus de détails.


erlangChat/
├── src/
│   ├── chat_server.erl        # Module principal du serveur de chat
│   ├── chat_client.erl        # Module principal du client de chat
│   ├── chat_notification.erl  # Module de gestion des notifications
│   ├── chat_group.erl         # Module de gestion des groupes de chat
│   ├── chat_utils.erl         # Utilitaires généraux pour le chat
│   └── ...                    # Autres modules nécessaires
├── include/
│   ├── chat.hrl               # Définitions de macros et de types
│   └── ...                    # Autres fichiers d'inclusion si nécessaire
├── priv/
│   ├── config/                # Configuration du serveur (fichiers de configuration)
│   ├── db/                    # Fichiers de base de données (si nécessaire)
│   └── ...                    # Autres ressources privées
├── ebin/                      # Répertoire où seront générés les fichiers .beam
│   └── ...                    # Fichiers .beam compilés
├── test/
│   ├── chat_server_tests.erl  # Tests pour le serveur de chat
│   ├── chat_client_tests.erl  # Tests pour le client de chat
│   ├── chat_notification_tests.erl  # Tests pour les notifications
│   ├── chat_group_tests.erl   # Tests pour les groupes de chat
│   └── ...                    # Autres tests unitaires et d'intégration
├── rebar.config               # Fichier de configuration de Rebar (outil de build pour Erlang)
└── README.md                  # Documentation du projet


tree
erlc tree.erl