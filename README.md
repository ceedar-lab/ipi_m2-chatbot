# Chatbot NodeJS

## Client Angular

- Se placer dans le répertoire **chatbot/server**.
- Si première installation, lancer la commande `npm i` pour télécharger les dépendances. 
- Lancer le client avec la commande :
  ```
  ng s --port 4200
  ```

## Serveur NodeJS Express

- Se placer dans le répertoire **chatbot/client**.
- Si première installation, lancer la commande `npm i` pour télécharger les dépendances. 
- Lancer le serveur avec la commande :
  ```
  npm start
  ```

## Fonctionnalités

Permet de recherche la météo d'une ou plusieurs villes.
Mots clés pour recherche la météo :
- météo (avec ou sans accent)
- climat
- temps

Si aucun nom de ville affiché, le bot demande `Vous voulez la météo de quelle ville ?`

Si aucun mot clé pour rechercher la météo, le bot indique que `C'est une belle ville` (sauf pour Marseille).

Si ni ville, ni météo, le bot indique `Désolé, je ne comprends pas`. 