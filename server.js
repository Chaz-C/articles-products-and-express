// jshint esversion: 6
const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');

const products = require('./routes/productsroutes');

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.get('/', (req,res) => {
  res.render('index');
});

app.use(bodyParser.urlencoded({ extended: true}));

app.use('/products', products);

module.exports = app;