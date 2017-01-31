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
    req.flash("error-msg", `There are no products`);
    res.redirect(303, '/products/new');
  });
});

router.get('/:id/edit', (req, res) => {
  products.getProductById(req.params.id)
  .then( results => {
    res.render('edit.hbs', { products: results, messages: res.locals.messages() } );
  })
  .catch( err => {
    req.flash("error-msg", `"${req.params.id}"" does not exist`);
    res.redirect(303, '/products/new');
  });
});

router.post('/search', (req, res) => {
  let id = req.body.value;
  res.redirect(303, `/products/${id}`);
});

router.get('/:id', (req, res) => {
  products.getProductById(req.params.id)
  .then( results => {
    res.render('product.hbs', { products: results, messages: res.locals.messages() } );
  })
  .catch( err => {
    req.flash("error-msg", `"${req.params.id}"" does not exist`);
    res.redirect(303, '/products/new');
  });
});

router.post('/', (req, res) => {
  let newProduct = req.body;
  products.stopDuplicates(newProduct)
  .then(function () {
    return products.productValidator(newProduct);
  })
  .then(function () {
    return products.postProduct(newProduct);
  })
  .then(function () {
    res.redirect('/products');
  })
  .catch( error => {
    req.flash("error-msg", "POST UNSUCCESSFUL Invalid value or Product already exists");
    res.redirect('/products/new');
  });
});

router.put('/:id', (req, res) => {
  let newProductValues = req.body;
  products.productValidator(newProductValues)
  .then(function () {
    return products.productPut(newProductValues, req.params.id);
  })
  .then(function () {
    res.redirect(303, `/products/${req.params.id}`);
  })
  .catch( error => {
    req.flash("error-msg", "PUT UNSUCCESSFUL Invalid property or value");
    res.redirect(303, `/products/${req.params.id}/edit`);
  });
});

router.delete('/delete', (req, res) => {
  products.deleteProduct(req.body.value)
  .then(function () {
    req.flash("success-msg", "DELETE SUCCESSFUL!!");
    res.redirect(303, '/products');
  })
  .catch( error => {
    req.flash("error-msg", "DELETE UNSUCCESSFUL, ID does not exist");
    res.redirect(303, '/products');
  });
});

module.exports = router;