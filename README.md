# CleanHive – SaaS de gestion de ménage à domicile

**CleanHive** est une application SaaS full stack basée sur une architecture **microservices**, permettant aux entreprises de ménage de gérer leurs clients, agents, réservations, facturations et opérations quotidiennes.

Elle offre une interface web moderne avec une structure modulaire, évolutive et sécurisée.

---

##  Stack technique

- **Frontend** : Angular (TypeScript)
- **Microservices (Backend)** : Spring Boot (Java)
- **Base de données** : PostgreSQL
- **Infrastructure** : Docker & Docker Compose
- **Communication** : REST, Eureka Discovery, Spring Cloud Gateway
- **Sécurité** : JWT, Rôles, Intercepteurs
- **Migration DB** : Flyway
- **Architecture** : Multi-tenant (entreprises)

---

##  Fonctionnalités principales

-  Authentification avec rôles (Client, Agent, Admin, Entreprise)
-  Réservation de services à domicile
-  Affectation automatique des agents
-  Gestion des utilisateurs, clients et entreprises
-  Tableau de bord personnalisés
-  Notifications par email / SMS (à venir)
-  Paiements en ligne via Stripe (à venir)
-  Architecture scalable multi-entreprises

---

## Structure du projet (microservices)

```text
homecleaning/
├── docker-compose.yml
│
├── infrastructure/
│   ├── config-server/         # Centralisation de configuration (Spring Cloud Config)
│   ├── discovery-server/      # Service registry (Eureka)
│   └── gateway/               # API Gateway (Spring Cloud Gateway)
│
├── services/
│   ├── identity-service/      # Authentification + gestion des utilisateurs
│   ├── booking-service/       # Gestion des réservations et plannings
│   └── billing-service/       # (à venir) Facturation et paiements
│
├── frontend/                  # Application Angular
│   ├── src/app/
│   │   ├── core/              # Auth, intercepteurs, services
│   │   ├── shared/            # Composants réutilisables
│   │   └── pages/             # Pages (dashboard, login, etc.)
│   └── environments/

````
---

##  Lancement rapide avec Docker
##  Prérequis
- Docker

- Docker Compose

- Java 17 / Maven (si build manuel)

###  Démarrage
### Build backend (si non déjà fait)
- cd services/identity-service
- ./mvnw clean package -DskipTests
- cd ../../

## Lancer tous les services
docker-compose up --build

## 🔗 Accès aux services

| Service            | URL                                            |
| ------------------ | ---------------------------------------------- |
| Frontend (Angular) | [http://localhost:4200](http://localhost:4200) |
| API Gateway        | [http://localhost:8080](http://localhost:8080) |
| Eureka Discovery   | [http://localhost:8761](http://localhost:8761) |
| Config Server      | [http://localhost:8888](http://localhost:8888) |
| PostgreSQL         | localhost:5432 (user\:password)                |
                                |

## Roadmap (TODO)
 - Intégration Stripe (paiement sécurisé)

 - Notifications Email / SMS (Twilio, Mailgun)

 - Chat en temps réel (WebSocket)

 - Tableau de bord avancé (stats, revenus, performances)

 - Portail entreprise SaaS avec onboarding & souscription

## 📄 Licence
Ce projet est open-source, proposé à des fins d’apprentissage. N’hésitez pas à l’utiliser ou le modifier selon vos besoins.

## Auteur Aochol
- 📫 www.linkedin.com/in/aochol-ayoul
---



