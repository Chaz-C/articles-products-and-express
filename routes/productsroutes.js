// jshint esversion: 6
const express = require('express');
const router = express.Router();
const productsDb = require('../db/products');
const bodyParser = require('body-parser');
const app = express();

let productsArr = productsDb.allProducts;

let newId = 0;

function allIds() {
  let idArr = [];
  for ( let i = 0; i < productsArr.length; i ++ ) {
    idArr.push(productsArr[i].id);
  }
  return idArr;
}

router.post('/', (req, res) => {
  let newItem = req.body;
  newItem.id = newId;
  productsArr.push(newItem);
  res.render('index', productsDb);
  console.log(productsArr);
  newId++;
});


module.exports = router;