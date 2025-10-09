# CleanHive – Plateforme SaaS de gestion de services de nettoyage

**CleanHive** est une application **SaaS full-stack** permettant aux entreprises de nettoyage de gérer leurs **clients**, **employés**, **services**, **réservations** et **abonnements** — tout en offrant aux **clients (particuliers ou entreprises)** une interface simple pour **rechercher et réserver** des services de nettoyage à proximité (domicile, bureaux ou locaux commerciaux).

Les clients peuvent simplement **saisir leur adresse** dans la barre de recherche pour découvrir les entreprises de nettoyage proches, consulter les services disponibles (ex. : nettoyage de vitres, tapis, entretien complet), et **réserver directement en ligne**.

Développée avec **Angular (frontend)** et **Spring Boot (backend)**, CleanHive combine **performance**, **scalabilité** et **simplicité**, tout en supportant un modèle **SaaS multi-entreprises**.

---

## Stack technique

| Couche         | Technologie |
|----------------|--------------|
| **Frontend**   | Angular (TypeScript) avec Angular Material |
| **Backend**    | Spring Boot (Java) |
| **Base de données** | PostgreSQL |
| **Infrastructure** | Docker & Docker Compose |
| **Communication** | REST API |
| **Sécurité** | JWT, rôles, intercepteurs |
| **Modèle** | Multi-entreprises (SaaS) |

---

## Fonctionnalités principales

- **Authentification avec rôles** (Client, Employé, Entreprise)  
- **Gestion des entreprises**, employés et services  
- **Abonnements SaaS** pour les entreprises  
- **Réservation de services** à domicile ou en entreprise  
- **Recherche par adresse** pour trouver les entreprises à proximité  
- **Tableau de bord** pour les entreprises (clients, réservations, statistiques)  
- **Notifications et paiements** (en cours d’intégration)

---

## Structure du projet

```text
CleanHive/
├── backend/                    # Backend Spring Boot
│   ├── src/main/java/
│   │   ├── com/cleanhive/
│   │   │   ├── entity/
│   │   │   ├── repository/
│   │   │   ├── service/
│   │   │   └── controller/
│   └── src/main/resources/
│       └── application.yml
│
├── frontend/                   # Frontend Angular
│   ├── src/app/
│   │   ├── core/              # Auth, services, intercepteurs
│   │   ├── features/          # Pages et composants principaux
│   │   └── shared/            # Composants et modèles réutilisables
│   └── environments/
│
├── docker-compose.yml          # Docker pour frontend + backend + DB
└── README.md


````
---

##  Lancement rapide avec Docker
##  Prérequis
- Docker

- Docker Compose

- Java 17 / Maven (si build manuel)

###  Démarrage
### Build backend (si non déjà fait)
- cd backend
- ./mvnw clean package -DskipTests
- cd ../../

## Lancer tous les services
docker-compose up --build

## 🔗 Accès aux services

| Service                       | URL                                            |
| ----------------------------- | ---------------------------------------------- |
| **Frontend (Angular)**        | [http://localhost:4200](http://localhost:4200) |
| **Backend API (Spring Boot)** | [http://localhost:8080](http://localhost:8080) |
| **PostgreSQL**                | `localhost:5432` *(user:password)*             |


## Roadmap (à venir)
 - Intégration Stripe (paiement sécurisé)

 - Notifications Email / SMS (Twilio, Mailgun)

 - Chat en temps réel (WebSocket)

 - Tableau de bord avancé (stats, revenus, performances)

 - Portail entreprise SaaS avec onboarding & souscription

## 📄 Licence
🚫 Ce projet est privé et destiné à un usage commercial.
Toute utilisation, copie ou redistribution est interdite sans autorisation expresse de l’auteur.

## Auteur Aochol
- 📫 www.linkedin.com/in/aochol-ayoul
---



