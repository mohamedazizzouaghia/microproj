# 🎓 EspritConnect - Plateforme Universitaire Microservices

![Java](https://img.shields.io/badge/Java-17-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Async-FF6600.svg)

**EspritConnect** est une plateforme complète dédiée à la gestion de la vie universitaire (profils, événements, réservations de salles, clubs et incidents) conçue de A à Z selon une architecture **microservices** robuste, évolutive et conteneurisée.

---

## 🏗️ Architecture du Projet

L'application est découpée en plusieurs services indépendants qui communiquent entre eux via l'API Gateway. 

### Liste des Microservices
| Service | Port | Rôle principal |
|---------|------|----------------|
| **eureka-server** | `8761` | Registre de découverte de services (Service Discovery). |
| **api-gateway** | `8080` | Point d'entrée unique, filtre JWT, routage et Swagger centralisé. |
| **auth-service** | `8084` | Inscription, connexion et génération de tokens JWT. |
| **user-service** | `8081` | Gestion des profils utilisateurs. |
| **event-service** | `8082` | Gestion des événements du campus et inscriptions. |
| **reservation-service**| `8083` | Réservation de salles et approbations administratives. |
| **club-service** | `8085` | Gestion des clubs étudiants, membres et annonces. |
| **incident-service** | `8086` | Signalement et suivi des incidents (maintenance, sécurité). |

---

## 🛠️ Stack Technique

- **Backend** : Java 17, Spring Boot 3.2, Spring Data JPA, H2 Database (In-Memory).
- **Cloud & Découverte** : Spring Cloud Netflix Eureka, Spring Cloud Gateway.
- **Communication Inter-services** : 
  - *Synchrone* : Spring Cloud OpenFeign.
  - *Asynchrone* : RabbitMQ (Spring AMQP).
- **Frontend** : React.js, Vite, Tailwind CSS, Recharts, Axios.
- **Sécurité** : Spring Security, JSON Web Tokens (JWT).
- **Documentation API** : SpringDoc OpenAPI (Swagger UI centralisé).
- **Déploiement & Ops** : Docker, Docker Compose.

---

## 🚀 Instructions de Lancement

Le projet peut être exécuté de deux manières différentes selon vos besoins (développement rapide ou test de l'environnement conteneurisé).

### Option 1 : Lancement Local (PowerShell)
Idéal pour le développement, sans avoir besoin de lancer Docker Desktop. Un script d'automatisation est fourni.

1. Ouvrez une invite PowerShell à la racine du projet (`C:\Users\aziz\Desktop\springproj`).
2. Exécutez le script d'orchestration :
   ```powershell
   .\start-all.ps1
   ```
> 💡 *Note : Le script lancera automatiquement Eureka et la Gateway en premier, suivis des microservices métier et du serveur React en arrière-plan.*

### Option 2 : Lancement Conteneurisé (Docker Compose)
Idéal pour un environnement de production-like complet et isolé (incluant RabbitMQ).

1. Assurez-vous que Docker Desktop est démarré.
2. Ouvrez un terminal à la racine du projet et exécutez :
   ```bash
   docker-compose build
   docker-compose up -d
   ```
3. Pour stopper l'environnement : `docker-compose down`

---

## 🔗 URLs Utiles

Une fois le projet démarré, voici les points d'accès principaux :

- 🌐 **Frontend React** : [http://localhost:5173](http://localhost:5173) (ou `http://localhost` si lancé via Docker)
- 📚 **Swagger UI Centralisé** : [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) (Toutes les APIs via la Gateway)
- 🧭 **Dashboard Eureka** : [http://localhost:8761](http://localhost:8761)
- 🐰 **RabbitMQ Management** : [http://localhost:15672](http://localhost:15672) (Identifiants: `guest` / `guest` — *uniquement disponible en mode Docker*)

### 🗄️ Accès aux Bases de Données (H2 Console)
Chaque microservice possède sa propre base de données en mémoire accessible via une interface web (H2 Console). 
- **User Service** : [http://localhost:8081/h2-console](http://localhost:8081/h2-console)
- **Event Service** : [http://localhost:8082/h2-console](http://localhost:8082/h2-console)
- **Reservation Service** : [http://localhost:8083/h2-console](http://localhost:8083/h2-console)
- **Auth Service** : [http://localhost:8084/h2-console](http://localhost:8084/h2-console)
- **Club Service** : [http://localhost:8085/h2-console](http://localhost:8085/h2-console)
- **Incident Service** : [http://localhost:8086/h2-console](http://localhost:8086/h2-console)

> ⚠️ **Erreur courante (Database not found)** : Sur la page de connexion H2, le champ **JDBC URL** est pré-rempli avec `jdbc:h2:~/test`. **Vous devez impérativement effacer cette valeur** et la remplacer par l'URL spécifique du service que vous consultez (ex: `jdbc:h2:mem:userdb`, `jdbc:h2:mem:eventdb`, etc.).
> - **Driver Class** : `org.h2.Driver`
> - **User Name** : `sa`
> - **Password** : *(laisser vide)*

---

## 🛡️ Sécurité JWT
La sécurité est centralisée mais décentralisée en termes de vérification :
1. Le client s'authentifie via le **`auth-service`** qui génère un Token JWT signé.
2. Toutes les requêtes suivantes sont envoyées à l'**`api-gateway`** avec le header `Authorization: Bearer <token>`.
3. Un filtre global dans la Gateway intercepte la requête, vérifie la signature mathématique du Token et, si elle est valide, laisse passer la requête vers le microservice cible sans avoir besoin de recontacter l'`auth-service`.

## 🔄 Communication Inter-Services
- **OpenFeign (Synchrone)** : Utilisé pour les requêtes bloquantes exigeant une réponse immédiate. Par exemple, le `event-service` appelle le `user-service` pour récupérer les détails de l'organisateur d'un événement lors de l'affichage.
- **RabbitMQ (Asynchrone)** : Utilisé pour l'architecture événementielle non-bloquante. Lorsqu'un nouvel incident est signalé dans le `incident-service`, un message est publié sur une file d'attente. Le `user-service` l'écoute en arrière-plan et déclenche une notification, sans ralentir le service d'origine.
