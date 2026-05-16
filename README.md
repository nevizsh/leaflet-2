# TP Bornes de recharge — Nouvelle-Calédonie (Leaflet)

Petite application web carte interactive des **bornes de recharge pour véhicules électriques** en Nouvelle-Calédonie, alimentée par les données ouvertes du gouvernement.

## Fonctionnalités

- **Carte** centrée sur la NC (fonds OpenStreetMap)
- **Chargement des bornes** via l’API Explore v2.1 de data.gouv.nc
- **Recherche / filtre** en temps réel sur la commune, le nom de station, l’adresse, l’opérateur ou l’aménageur
- **Clic sur un marqueur** : panneau latéral avec le détail des champs disponibles (nom, adresse, opérateur, puissance, horaires, etc.)
- **Borne la plus proche** : géolocalisation + itinéraire vers la borne la plus proche parmi les marqueurs **actuellement visibles** (Leaflet Routing Machine)
- **Réinitialiser** : efface la recherche, réaffiche tous les marqueurs, ferme le panneau et supprime l’itinéraire affiché
- Compteur du nombre de bornes affichées

## Stach technique

| Élément | Usage |
|--------|--------|
| HTML5 / CSS3 | Mise en page, toolbar, panneau latéral |
| [Leaflet](https://leafletjs.com/) 1.9 | Carte et marqueurs |
| [Leaflet Routing Machine](https://www.liedman.net/leaflet-routing-machine/) | Calcul d’itinéraire |
| [jQuery](https://jquery.com/) 3.7 | Requêtes AJAX et manipulation du DOM |
| [data.gouv.nc](https://data.gouv.nc/) | Jeu de données officiel |

## Jeu de données

- **Catalogue** : [Bornes de recharge pour véhicules électriques](https://data.gouv.nc/explore/dataset/bornes-de-recharge-pour-vehicules-electriques)
- L’app appelle l’endpoint **Explore API v2.1** (échantillon actuel : `limit=100` dans `js/app.js`)

## Lancer en local

Projet statique : aucune étape de build.

1. Cloner ou télécharger le dépôt
2. Ouvrir `index.html` dans un navigateur **ou** servir le dossier racine :

   ```bash
   npx serve .
   ```

   Puis ouvrir l’URL indiquée (souvent `http://localhost:3000`).
