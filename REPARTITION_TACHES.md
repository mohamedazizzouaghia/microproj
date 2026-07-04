# 📋 Répartition des Tâches — EspritConnect (Fullstack)

Afin d'assurer une maîtrise complète (de bout en bout) par chaque membre de l'équipe, la répartition a été pensée en **mode Fullstack vertical**. 
Chaque étudiant est responsable de l'intégralité d'un domaine métier : de sa base de données, son microservice Spring Boot, jusqu'à ses pages React, tout en prenant en charge une responsabilité technique transverse (DevOps, Infra, Testing, etc.).

---

## 👥 Tableau Récapitulatif

| Membre | Microservice(s) Backend | Pages Frontend (React) | Responsabilité Transverse |
|--------|--------------------------|-------------------------|---------------------------|
| **Aziz** | `auth-service` | `/login`, `/register` | API Gateway, Sécurité JWT, Docker |
| **Anas** | `event-service` & `reservation-service` | `/events`, `/reservations` | Tests Unitaires (JUnit / Playwright) |
| **Siwar** | `club-service` | `/clubs` | Architecture UI/UX, Base Frontend |
| **Eslem** | `incident-service` | `/incidents` | RabbitMQ (Asynchrone), Eureka |
| **Islem** | `user-service` | `/profile`, `/users`, `/admin/logs` | Swagger Centralisé, README |

---

## 🔵 1. Aziz — Authentification & DevOps

**Domaine Métier : Identité et Accès**
- **Backend (`auth-service`)** : Création de l'entité `User` (sécurisée avec mot de passe BCrypt). Création des endpoints `/auth/register` et `/auth/login` permettant la génération de tokens JWT via la librairie `jjwt`.
- **Frontend** : Développement complet des pages `Login.jsx` et `Register.jsx`, gestion de la sauvegarde du token dans le `localStorage` et redirection conditionnelle selon le rôle.

**Tâches Transverses :**
- **API Gateway & Sécurité** : Configuration de la Gateway sur le port `8080`, écriture du `JwtAuthenticationFilter` pour valider la signature de chaque requête entrante avant de la router.
- **Docker & Orchestration** : Rédaction des `Dockerfile` pour tous les services, création du réseau `esprit-net` et écriture du `docker-compose.yml` complet orchestrant les 10 conteneurs de l'application.

---

## 🟢 2. Anas — Événements, Salles & Qualité

**Domaine Métier : Vie Associative et Réservations**
- **Backend (`event-service` & `reservation-service`)** : 
  - Logique de gestion des événements (`Event`, capacité, catégories, inscriptions).
  - Logique de réservation de salles (`Room`, `Reservation`, cycle d'approbation).
  - Implémentation d'un client `OpenFeign` pour récupérer les détails des utilisateurs de manière synchrone.
- **Frontend** : Développement des pages `Events.jsx` (avec barres de recherche, catégories dynamiques et modales d'inscription) et `Reservations.jsx` (tableaux de bord d'approbation).

**Tâches Transverses :**
- **Tests (Assurance Qualité)** : Mise en place de `spring-boot-starter-test`, rédaction des tests unitaires JUnit pour la logique métier et tests d'intégration E2E.

---

## 🟣 3. Siwar — Clubs & Architecture Frontend

**Domaine Métier : Gestion des Clubs Étudiants**
- **Backend (`club-service`)** : Modélisation des clubs (`Club`), des membres (`ClubMembership`) et des annonces (`ClubPost`). Endpoints REST complets (rejoindre, quitter, publier).
- **Frontend** : Développement de la page `Clubs.jsx` (gestion du CRUD Admin, affichage des statistiques des clubs).

**Tâches Transverses :**
- **Architecture Frontend (React/Vite)** : 
  - Configuration de Tailwind CSS et du design system (couleurs, chartes).
  - Création du `Layout.jsx` global (Sidebar de navigation, Topbar avec menus déroulants).
  - Implémentation du client central `api.js` d'Axios injectant automatiquement le token JWT dans chaque requête.

---

## 🟠 4. Eslem — Incidents & Message Broker

**Domaine Métier : Maintenance et Signalements**
- **Backend (`incident-service`)** : Gestion des signalements (`Incident`) avec cycle de vie complexe (états : OPEN, IN_PROGRESS, RESOLVED).
- **Frontend** : Développement de la page `Incidents.jsx` (formulaire de signalement dynamique, changement d'état en temps réel pour l'admin avec badges de statut).

**Tâches Transverses :**
- **RabbitMQ (Événementiel Asynchrone)** : Mise en place du broker de messages. Configuration de la publication (`RabbitTemplate`) pour notifier asynchrone le reste du système lors d'un incident critique (ex: panne d'un amphi).
- **Service Discovery (Eureka)** : Configuration du serveur Eureka et rattachement de tous les clients microservices à l'annuaire dynamique.

---

## 🔴 5. Islem — Utilisateurs, Logs & Documentation

**Domaine Métier : Profils et Administration**
- **Backend (`user-service`)** : Séparation des profils étendus (`UserProfile`) de la logique d'authentification. Logique de statistiques globales du campus.
- **Frontend** : 
  - Développement de la page `/profile` et `/users`.
  - Développement de la page complexe `/admin/logs` (`SystemLogs.jsx`) qui ping l'API Gateway pour vérifier la latence et le statut UP/DOWN de tous les services en temps réel.

**Tâches Transverses :**
- **Swagger Centralisé** : Configuration de `springdoc-openapi` dans chaque microservice (avec JWT Bearer configuration), et agrégation complète sur l'API Gateway pour avoir une documentation unique (`/swagger-ui.html`).
- **Documentation** : Rédaction du `README.md` et explication architecturale de la plateforme.
