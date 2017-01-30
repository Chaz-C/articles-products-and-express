const express = require('express');
const router = express.Router();
const app = express();

const products = require('../db/products');

router.get('/new', (req, res) => {
  res.render('new.hbs', { messages: res.locals.messages()} );
});

router.get('/', (req, res) => {
  products.getAllProducts()
  .then( results => {
    res.render('index', { products: results, messages: res.locals.messages() });
  })
  .catch( error => {
    console.log(error);
  });
});

router.get('/:id/edit', (req, res) => {
  products.getProductById(req.params.id)
  .then( results => {
    res.render('edit.hbs', { products: results, messages: res.locals.messages() } );
  })
  .catch( err => {
    console.log(err);
  });
});

router.get('/:id', (req, res) => {
  products.getProductById(req.params.id)
  .then( results => {
    res.render('product.hbs', { products: results, messages: res.locals.messages() } );
  })
  .catch( err => {
    console.log(err);
  });
});


router.post('/', (req, res) => {
  let newProduct = req.body;

  if ( newProduct.hasOwnProperty('name') && newProduct.hasOwnProperty('price') &&
    newProduct.hasOwnProperty('inventory') && newProduct.name !== '' && newProduct.price !== '' && newProduct.inventory !== '' ) {

    products.postProduct(newProduct)
    .then(function () {
      res.redirect('/products');
    })
    .catch( error => {
      req.flash("error-msg", "POST UNSUCCESSFUL Invalid property or value");
      res.redirect('/products/new');
    });

  } else {
    req.flash("error-msg", "POST UNSUCCESSFUL Invalid property or value");
    res.redirect('/products/new');
  }
});

router.put('/:id', (req, res) => {
  let newProductValues = req.body;

  products.productPut(newProductValues, req.params.id)
  .then(function () {
    res.redirect(303, `/products/${req.params.id}`);
  })
  .catch( error => {
    console.log(error);
    req.flash("error-msg", "PUT UNSUCCESSFUL Invalid property or value");
    res.redirect(303, `/products/${req.params.id}/edit`);
  });

});

router.delete('/:id', (req, res) => {

    products.deleteProduct(req.params.id)
    .then(function () {
      res.redirect(303, '/products');
    })
    .catch( error => {
      console.log(error);
      req.flash("error-msg", "DELETE UNSUCCESSFUL, ID does not exist");
      res.redirect(303, '/products');
    });
});

module.exports = router;