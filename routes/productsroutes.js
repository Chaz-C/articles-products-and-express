// jshint esversion: 6
const express = require('express');
const router = express.Router();
const productsDb = require('../db/products');
const bodyParser = require('body-parser');
const app = express();

let productsArr = productsDb.allProducts;

let newId = 0;

function findIndex(id) {
  let idArr = [];

  for ( let i = 0; i < productsArr.length; i ++ ) {
    idArr.push(productsArr[i].id);
  }

  if ( idArr.indexOf(parseInt(id)) > -1 ) {
    return idArr.indexOf(parseInt(id));
  } else {
    return false;
  }
}

router.get('/', (req, res) => {
  res.render('index', productsDb);
});

router.get('/:id', (req, res) => {
  let index = findIndex(req.params.id);
  console.log('index', index);
  res.render('product', productsArr[index]);
});

router.post('/', (req, res) => {
  let newItem = req.body;
  newItem.id = newId;
  productsArr.push(newItem);
  res.redirect('/products');
  newId++;
});




module.exports = router;