# Chatbot NodeJS

## <br />Client Angular

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

Permet de recherche la météo d'une ville.
Mots clés pour recherche la météo :
- `météo` (avec ou sans accent).
- `climat`
- `temps`

Si aucun nom de ville affiché, le bot demande `Vous voulez la météo de quelle ville ?`

Si aucun mot clé pour rechercher la météo, le bot indique que `C'est une belle ville`.

Si ni ville, ni météo, le bot indique `Désolé, je ne comprends pas`.

**Par défaut, la météo affichée est la météo du jour, à l'heure ou l'utilisateur envoie sa demande. Il est possible de mofifier ce comportement.**
### <u>Recherche de la météo à une date différente</u>

Certains mots clés sont détécté et permettent de recherche la météo à une date différente de la date du jour :
- `aujourd'hui` : Recherche au jour J.
- `demain` : Recherche à J+1.
- `après demain` : Recherche à J+2.

### <u>Recherche de la météo à une heure différente</u>

Il est possible de taper plusieurs patterns d'heures pour rechercher la méteo à différents moments de la journée :
- `14h` ou `14 h`
- `14heure` ou `14 heure`
- `14heures` ou `14 heures`