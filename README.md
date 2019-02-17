# Web-Application :computer: Final-Report :memo:
Create a Web App using NodeJS & React : List the best rates - for each Weekend - for France located Relais &amp; Châteaux with starred restaurants

## Scrap the web with nodeJS and Cheerio

- **1ère étape** : Scraper le site Michelin pour avoir le nom de tous les restaurants étoilés : *scrapingMichelin.js* => *restaurants.json*
- **2ème étape** : Récupérer les urls de chaque hôtel Relais & Chateau en France pour récupérer les informations nécessaires *scraping() relais.js* => *urls_hotels.json*
- **3ème étape** : Définir si oui ou non l'hôtel possède un restaurant étoilé en comparant les noms des restaurants de chaque hôtel avec la liste des restaurants étoilés Michelin 
(PB: difficile de faire correspondre le nom du restaurant sur R&C et Michelin car les noms varient parfois)

> Changement de stratégie : 

#### SCRAPING ON RELAIS&CHATEAUX (NodeJS)

- **1ère étape** : Récupérer les urls de chaque hotel Relais & Chateau en France: *scraping() relais.js*

- **2ème étape** : Scraper les urls et définir si le restaurant est étoilé (recherche dans le titre exemple: "Maison Decoret, Hôtel de luxe et Restaurant gastronomique étoilé en ville 1 étoile Vichy – Relais & Châteaux" ): *isStars() relais.js*

- **3ème étape** : Récupérer les prix de chaque week-end du mois de Mars pour tous les hotels avec restaurant étoilé : *getPrice() relais.js*
Pour cela : 

- **4ème étape** : On doit fetch une requête : "https://www.relaischateaux.com/fr/popin/availability/check?month=2019-3&idEntity=22926"%7C%7CSTD&pax=2&room=1" et on a besoin du *'idEntity'* propre à chaque hotel. Pour cela, nous avons créé la fonction *getidEntity()* => idEntity fetch chaque requête de chaque hotel.

- **5ème étape** : Trouver le meilleur prix pour un weekend en Mars 2019 dans un des hotels Relais & Chateaux avec restaurant étoilé Michelin : *getBest() relais.js*

- **6ème étape** : Récupérez les informations importantes pour ce meilleur prix : Nom de l'hotel, date et prix.

Au final, nous utilisons un fichier JSON contenant 12 hôtels Relais & Châteaux ayant un restaurant étoilé Michelin, leurs prix pour chaque week-end de Mars (nuit du Samedi au Dimanche) et leur disponibilité.

PS: Pour récupérer les prix au mois de Mars de chaque hôtel en temps réel, il faudrait que *getPrice()* soit appelé à chaque fois que l'application est lancée. La fonction prend environ 10 min à générer le *Marc_WE.json*. Pour des raisons d'efficacité, la fonction à générer un json le 15 Février 2019 avec les prix et disponibilité à ce jour et n'ai plus appelée dans le programme. Afin que l'application fonctionne correctement nous utilisons ce fichier.json. Les données ne sont donc pas scrapper en temps réel.   

 
## Build a Web App with ReactJS and create-react-app 

- **1ère étape**: Création de l'application et de l'environnement de développement
- **2ème étape**: Utilisation des fonctions clé et importation des json générés précédemment
- **3ème étape**: Design en html/css de la page web de l'application

## FINAL RESULT :

- We scrap all prices for each hostels with a stared restaurant for every weekend of March.
- We store the results into a json file called *March_WE.json*.
- We print the results into tabs threw a web application where we can find the best rate for March 2019 and a summary of all hostels with stared restaurant and their price for the weekends of March.

![Screenshot](Capture.JPG)



