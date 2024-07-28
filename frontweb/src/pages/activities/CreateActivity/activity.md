D'accord, voici une description détaillée de chaque écran de création d'activité, en veillant à limiter chaque écran à 5 ou 6 détails maximum :

1. Détails de base de l'activité
   Champs nécessaires :

Titre (title) : Le nom de l'activité.
Description (description) : Une description détaillée de l'activité.
Type d'activité (createAtivityType) : Type ou catégorie de l'activité.
Image de l'activité (activityImage) : URL de l'image de l'activité.
Auteur (author) : Identifiant de l'utilisateur qui crée l'activité (peut être sélectionné automatiquement). 2. Co-organisateurs et participants
Champs nécessaires :

Co-organisateurs (coOrganizers) : Liste d'identifiants des utilisateurs co-organisateurs.
Participants non approuvés (unApprovedUsers) : Liste d'identifiants des utilisateurs non approuvés.
Co-organisateurs non approuvés (unApprovedCoOrganizers) : Liste d'identifiants des co-organisateurs non approuvés.
Attendees (attendees) : Liste d'identifiants des participants approuvés.
Liste d'attente (waitingList) : Liste d'identifiants des utilisateurs en liste d'attente. 3. Horaires et dates
Champs nécessaires :

Date (date) : La date de l'activité.
Heure de début (startTime) : Heure de début (objet avec heure et minute).
Heure de fin (endTime) : Heure de fin (objet avec heure et minute).
Evénement récurrent (repeatEvent) : Checkbox.
Fréquence de répétition (repeatEventFrequency) : Fréquence de répétition (si l'événement est récurrent).
Jours de répétition (repeatEventDays) : Liste de jours (si l'événement est récurrent). 4. Localisation
Champs nécessaires :

Adresse (location.address) : L'adresse de l'activité.
Station de métro la plus proche (metroStation) : Nom de la station de métro la plus proche.
En ligne (isOnline) : Checkbox indiquant si l'activité est en ligne.
Option pour rendre l'adresse visible uniquement pour les participants (addressOnlyForAttendees) : Checkbox.
Coordonnées GPS (latitude et longitude) (ces champs peuvent être gérés automatiquement par Google Maps, donc pas besoin d'être visibles dans le formulaire). 5. Options supplémentaires
Champs nécessaires :

Lien d'achat de billets (buyTicketsLink) : URL pour acheter des billets.
Nombre d'amis (friendsNumber) : Nombre d'amis pouvant être invités.
Notifier les précédents participants (notifyPreviousAttendees) : Checkbox.
Inviter plus (inviteMore) : Checkbox.
Demander co-organisation (requestCoOrga) : Checkbox. 6. Restrictions et validation des participants
Champs nécessaires :

Restriction d'âge (ageRestriction) : Checkbox.
Ages autorisés (ages) : Liste d'âges autorisés (si la restriction d'âge est activée).
Validation des participants (attendeesValidation) : Checkbox.
Limite de participants (attendeeLimit) : Nombre maximum de participants.
Autoriser les invités (allowGuests) : Checkbox. 7. Prix et liens
Champs nécessaires :

Activité payante (hasPrice) : Checkbox.
Prix (price) : Montant du prix (si l'activité est payante).
Lien de ticket (ticketLink) : URL pour le ticket (si applicable).
Ligne d'information (infoLine) : Informations supplémentaires.
Comment trouver l'activité (howToFind) : Instructions sur la façon de trouver l'activité. 8. Liens de réseaux sociaux
Champs nécessaires :

Lien WhatsApp (whatsappLink) : URL du groupe WhatsApp.
Lien de la page Facebook (fbPageLink) : URL de la page Facebook.
Lien du groupe Facebook (fbGroupLink) : URL du groupe Facebook.
Lien Meetup (meetupLink) : URL de la page Meetup.
Lien Telegram (telegramLink) : URL du groupe Telegram.
Autres liens (otherLink) : Autres URL pertinentes. 9. Notification et options de gestion
Champs nécessaires :

Notification des interactions (notificationSettings) : Paramètres de notification (mappe de configurations).
Gérer la parité (manageParityIsSelected) : Checkbox.
Pourcentage de parité masculine (manageParityMalePercentage) : Pourcentage.
Ligne d'information sur la parité (manageParityInfoLine) : Informations sur la parité.
Amis autorisés par la parité (manageParityFriendsAllowed) : Nombre d'amis autorisés. 10. Validation et soumission
Résumé de tous les champs précédemment saisis et confirmation de soumission.

Revoir les détails de l'activité.
Bouton "Soumettre" pour envoyer le formulaire.
Interface utilisateur pour la navigation entre les sections
Boutons "Suivant" et "Précédent" pour naviguer entre les sections.
Un bouton "Soumettre" dans la dernière section pour envoyer le formulaire.
