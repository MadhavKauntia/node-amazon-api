const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const cheerio = require('cheerio');

const url = 'https://www.amazon.in/dp/';

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('This is the Amazon API.');
});

app.get('/amazon/:id', (req, res) => {
    var id = req.params.id;
    const options = {
        uri: url+id,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    rp(options)
        .then(($) => {
            var productTitle = $('#productTitle').text().replace(/\n/gm, "").trim();
            var price = $('#priceblock_dealprice').text().replace(/\n/gm, "").trim();
            var rating = $('#acrPopover').attr('title');
            var reviewsLink = 'https://www.amazon.in' + $('#acrCustomerReviewLink').attr('href');
            var imageUrl = $('#landingImage').attr('data-old-hires');
            var jsonFile = {productTitle, price, rating, reviewsLink, imageUrl};
            res.send(jsonFile);
        }, (e) => {
      });
});

app.listen(port, () => {
   console.log(`Port started on ${port}`);
});
