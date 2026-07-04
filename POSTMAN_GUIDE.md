# Guide de Test Postman - EspritConnect

Ce guide explique comment tester l'intégralité de l'architecture microservices EspritConnect en utilisant **Postman**. Vous n'avez pas besoin de tester chaque microservice individuellement : toutes les requêtes passeront par l'**API Gateway** sur le port `8080`.

## Méthode 1 : Importation Rapide (Recommandée)
J'ai généré une collection Postman prête à l'emploi. Vous pouvez l'importer directement dans votre application Postman :
1. Ouvrez **Postman**.
2. Cliquez sur le bouton **"Import"** en haut à gauche.
3. Glissez-déposez le fichier `espritconnect_postman_collection.json` (qui se trouve dans le dossier de votre projet) ou sélectionnez-le manuellement.
4. Une collection nommée **"EspritConnect"** apparaîtra avec toutes les requêtes prêtes à être exécutées !

---

## Méthode 2 : Test Manuel Étape par Étape

Si vous souhaitez créer les requêtes manuellement dans Postman, voici la documentation de toutes les API.

> **Rappel** : L'URL de base pour **toutes** les requêtes est `http://localhost:8080`.

### 1. User Service (Service Utilisateur)

#### ➤ Créer un utilisateur
- **Méthode :** `POST`
- **URL :** `http://localhost:8080/users`
- **Headers :** `Content-Type: application/json`
- **Body (raw / JSON) :**
  ```json
  {
    "name": "Ahmed Ben Salah",
    "email": "ahmed@esprit.tn",
    "role": "PROFESSOR"
  }
  ```

#### ➤ Récupérer tous les utilisateurs
- **Méthode :** `GET`
- **URL :** `http://localhost:8080/users`

#### ➤ Récupérer un utilisateur par ID
- **Méthode :** `GET`
- **URL :** `http://localhost:8080/users/1`

---

### 2. Event Service (Service Événement)

#### ➤ Créer un événement
- **Méthode :** `POST`
- **URL :** `http://localhost:8080/events`
- **Headers :** `Content-Type: application/json`
- **Body (raw / JSON) :**
  ```json
  {
    "title": "Hackathon 2026",
    "description": "Microservices challenge",
    "date": "2026-10-15",
    "organizerId": 1
  }
  ```
  *(Note : `organizerId` correspond à l'ID de l'utilisateur créé précédemment)*

#### ➤ Récupérer tous les événements
- **Méthode :** `GET`
- **URL :** `http://localhost:8080/events`

#### ➤ Récupérer un événement avec son organisateur (Test OpenFeign)
- **Méthode :** `GET`
- **URL :** `http://localhost:8080/events/1/with-organizer`
- **Résultat attendu :** Les détails de l'événement **ET** de l'utilisateur qui l'organise seront retournés. L'`event-service` contacte le `user-service` en arrière-plan.

---

### 3. Reservation Service (Service Réservation)

#### ➤ Créer une réservation
- **Méthode :** `POST`
- **URL :** `http://localhost:8080/reservations`
- **Headers :** `Content-Type: application/json`
- **Body (raw / JSON) :**
  ```json
  {
    "roomName": "Amphi A",
    "studentId": 1,
    "date": "2026-10-15",
    "eventId": 1
  }
  ```

#### ➤ Récupérer toutes les réservations
- **Méthode :** `GET`
- **URL :** `http://localhost:8080/reservations`

#### ➤ Récupérer une réservation avec l'événement associé (Test OpenFeign)
- **Méthode :** `GET`
- **URL :** `http://localhost:8080/reservations/1/with-event`
- **Résultat attendu :** Les détails de la réservation **ET** de l'événement réservé. Le `reservation-service` contacte l'`event-service` en arrière-plan.

---

### 🎯 Bonnes pratiques pour la démonstration au professeur
1. Commencez toujours par montrer que tous les services sont bien enregistrés sur **Eureka** : [http://localhost:8761](http://localhost:8761).
2. Ensuite, dans **Postman**, soulignez bien que vous ne tapez **que** sur le port `8080` (API Gateway) pour toutes les requêtes.
3. Exécutez les requêtes dans l'ordre (Créer User -> Créer Event -> Créer Réservation).
4. Pour finir, montrez les appels `/with-organizer` et `/with-event` et expliquez que c'est **OpenFeign** qui s'occupe de faire la jointure entre les microservices.
