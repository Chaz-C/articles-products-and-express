// jshint esversion: 6
const express = require('express');
const router = express.Router();
const productsDb = require('../db/products');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true}));

router.post('/', (req, res) => {
  productsDb.allProducts.push(req.body);
  console.log(productsDb.allProducts);
  res.render('index', productsDb);
});


module.exports = router;