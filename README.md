# Scraper - The New York Times

Scraper utilizes **Cheerio** and **MongoDB** to "scrape" articles from the New York Times US section and store them in a database to be viewed and commented on by users.

## Functionality

### Scraping

When you visit the site, The New York Times US Section will automatically be scraped for the most recent articles. The number of new articles will be displayed in the header, as well as be marked within each article with a "new" badge. Viewing the article by clicking "Go To Article" or the "new" badge will remove the "new" badge and update the count. Refreshing the page or clicking the Scrape button will also mark these articles as no longer being new.

All visitors to the page can leave notes on the article by clicking the View/Add Notes link.

![Scraping](https://github.com/Milleniyum/NYT-Scraper/blob/master/public/images/scraping.gif)

### Favorites

User can mark their favorite articles by clicking the star icon on each article. Notification toasts will appear on screen indicating if a favorite has been added or removed. Clicking the favorites button will navigate to the favorites page where these articles will be filtered from non-favorited articles.

![Favorites](https://github.com/Milleniyum/NYT-Scraper/blob/master/public/images/favorites.gif)

Heroku Deployment:  https://rocky-spire-38153.herokuapp.com/



## Technology

* HTML
* CSS
* Materialize
* JQuery
* Javascript
* Node
* Express
* Cheerio
* MongoDB
* Mongoose
* Handlebars
* Axios
* Heroku

## Contact
**Email** jdlong1980@gmail.com | **Website** www.jamiedelong.com | **GitHub** https://github.com/Milleniyum