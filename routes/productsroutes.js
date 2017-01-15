const express = require('express');
const router = express.Router();
const productsDb = require('../db/products');
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
  res.render('new.hbs', { messages: res.locals.messages()} );
});

router.get('/', (req, res) => {
  res.render('index', { products: productsDb, messages: res.locals.messages() });
});

router.get('/:id/edit', (req, res) => {
  let index = findIndex(req.params.id);
  res.render('edit.hbs', { productsArr: productsArr[index], messages: res.locals.messages() } );
});

router.get('/:id', (req, res) => {
  let index = findIndex(req.params.id);
  res.render('product', productsArr[index]);
});


router.post('/', (req, res) => {
  let newItem = req.body;

  if ( newItem.hasOwnProperty('name') && newItem.hasOwnProperty('price') &&
    newItem.hasOwnProperty('inventory') && newItem.name !== '' && newItem.price !== '' && newItem.inventory !== '' ) {
    newItem.id = `${newId}`;
    productsArr.push(newItem);
    res.redirect('/products');
    newId++;
  } else {
    req.flash("error-msg", "POST UNSUCCESSFUL Invalid property or value");
    res.redirect('/products/new');
  }
});

router.put('/:id', (req, res) => {
  let index = findIndex(req.params.id);
  let newProductValues = req.body;
  let editProduct = productsArr[index];
  if ( newProductValues.hasOwnProperty('name') || newProductValues.hasOwnProperty('price') || newProductValues.hasOwnProperty('inventory') ) {

        if ( newProductValues.hasOwnProperty('name') && newProductValues.name !== '' ) {
          editProduct.name = newProductValues.name;
        }
        if ( newProductValues.hasOwnProperty('price') && newProductValues.price !== '') {
          editProduct.price = newProductValues.price;
        }
        if ( newProductValues.hasOwnProperty('inventory') && newProductValues.inventory !== '') {
          editProduct.inventory = newProductValues.inventory;
        }
          res.redirect(303, `/products/${req.params.id}`);
    } else {
      req.flash("error-msg", "PUT UNSUCCESSFUL Invalid property or value");
      res.redirect(303, `/products/${req.params.id}/edit`);
  }
});

router.delete('/:id', (req, res) => {
  let index = findIndex(req.params.id);

  if ( index === false ) {
    req.flash("error-msg", "DELETE UNSUCCESSFUL, ID does not exist");
    res.redirect(303, '/products');
  } else {
    productsArr.splice(index, 1);
    res.redirect(303, '/products');
  }
});




module.exports = router;