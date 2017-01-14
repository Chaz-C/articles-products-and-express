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

  if ( idArr.indexOf(`${id}`) > -1 ) {
    return idArr.indexOf(`${id}`);
  } else {
    return false;
  }
}

router.get('/new', (req, res) => {
  res.render('new.hbs');
});

router.get('/', (req, res) => {
  res.render('index', productsDb);
});

router.get('/:id/edit', (req, res) => {
  console.log(req.params.id);
  let index = findIndex(req.params.id);
  res.render('edit.hbs', productsArr[index]);
});

router.get('/:id', (req, res) => {
  let index = findIndex(req.params.id);
  res.render('product', productsArr[index]);
});


router.post('/', (req, res) => {
  let newItem = req.body;
  newItem.id = `${newId}`;
  productsArr.push(newItem);
  res.redirect('/products');
  newId++;
});

router.put('/:id', (req, res) => {
  console.log('put working-ish');
  let index = findIndex(req.params.id);
  let newProductValues = req.body;
  let editProduct = productsArr[index];
  if ( editProduct.hasOwnProperty('name')) {
    editProduct.name = newProductValues.name;
  }
  if ( editProduct.hasOwnProperty('price')) {
    editProduct.price = newProductValues.price;
  }
  if ( editProduct.hasOwnProperty('inventory')) {
    editProduct.inventory = newProductValues.inventory;
  }
  res.redirect(303, `/products/${req.params.id}`);
});




module.exports = router;