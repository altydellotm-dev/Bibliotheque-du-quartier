# Bibliotheque de quartier

Application de gestion d'une bibliotheque de quartier - Projet individuel Semaines 14-15, Akieni Academy Cohorte 2.

## Stack technique

- Backend : Node.js, Express, PostgreSQL
- Frontend : HTML, CSS, JavaScript (vanilla), fetch API

## Installation

1. Cloner le depot
2. Installer les dependances :npm install
3. Creer un fichier `.env` a la racine sur le modele de `.env.example`, avec votre mot de passe PostgreSQL
4. Creer la base de donnees et charger le schema :
   psql -U postgres
   CREATE DATABASE bibliotheque;
   \c bibliotheque
   \i schema.sql
5. Lancer le serveur :npm run dev
6. Ouvrir `http://localhost:3000` dans le navigateur

## Choix de modelisation

- 4 tables : `auteurs`, `adherents`, `livres`, `emprunts`
- Un livre appartient a un seul auteur (simplification, pas de co-auteurs geres)
- La table `emprunts` fait la liaison entre `adherents` et `livres`, avec `date_retour_effective` (NULL tant que le livre n'est pas rendu) pour distinguer emprunts en cours et emprunts termines, et detecter les retards
- Le statut du livre (`disponible` / `emprunte`) est mis a jour automatiquement a la creation et au retour d'un emprunt

## Structure du projetsrc/

config/db.js Connexion PostgreSQL
middlewares/ Logger et gestion d'erreurs
routes/ Definition des routes Express
controllers/ Logique metier
public/ Frontend (HTML/CSS/JS)
schema.sql Script de creation des tables
