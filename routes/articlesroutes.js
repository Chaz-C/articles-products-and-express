const express = require('express');
const router = express.Router();
const articlesDb = require('../db/articles');
const app = express();

let articlesArr = articlesDb.allArticles;

function findIndex(title) {
  let titleArr = [];

  for ( let i = 0; i < articlesArr.length; i ++ ) {
    titleArr.push(articlesArr[i].title);
  }

  if ( titleArr.indexOf(title) > -1 ) {
    return titleArr.indexOf(title);
  } else {
    return false;
  }
}

router.get('/new', (req, res) => {
  res.render('new.hbs', { articles: true, messages: res.locals.messages()} );
});

router.get('/', (req, res) => {
  res.render('index', { articles: articlesDb, messages: res.locals.messages() });
});

// router.get('/:id/edit', (req, res) => {
//   let index = findIndex(req.params.id);
//   res.render('edit.hbs', { productsArr: productsArr[index], messages: res.locals.messages() } );
// });

router.get('/:title', (req, res) => {
  console.log(req.params.title);
  let index = findIndex(req.params.title);
  console.log(index);
  res.render('article', articlesArr[index]);
});


router.post('/', (req, res) => {
  let newArticle = req.body;

  if ( newArticle.hasOwnProperty('title') && newArticle.hasOwnProperty('body') &&
    newArticle.hasOwnProperty('author') && newArticle.title !== '' && newArticle.body !== '' && newArticle.author !== '' ) {
    let createUrlTitle =
    newArticle.urlTitle = `${encodeURIComponent(newArticle.title)}`;
    articlesArr.push(newArticle);
    res.redirect('/articles');
  } else {
    req.flash("error-msg", "POST UNSUCCESSFUL Invalid property or value");
    res.redirect('/articles/new');
  }
});

// router.put('/:id', (req, res) => {
//   let index = findIndex(req.params.id);
//   let newProductValues = req.body;
//   let editProduct = productsArr[index];
//   if ( newProductValues.hasOwnProperty('name') || newProductValues.hasOwnProperty('price') || newProductValues.hasOwnProperty('inventory') ) {

//         if ( newProductValues.hasOwnProperty('name') && newProductValues.name !== '' ) {
//           editProduct.name = newProductValues.name;
//         }
//         if ( newProductValues.hasOwnProperty('price') && newProductValues.price !== '') {
//           editProduct.price = newProductValues.price;
//         }
//         if ( newProductValues.hasOwnProperty('inventory') && newProductValues.inventory !== '') {
//           editProduct.inventory = newProductValues.inventory;
//         }
//           res.redirect(303, `/products/${req.params.id}`);
//     } else {
//       req.flash("error-msg", "PUT UNSUCCESSFUL Invalid property or value");
//       res.redirect(303, `/products/${req.params.id}/edit`);
//   }
// });

// router.delete('/:id', (req, res) => {
//   let index = findIndex(req.params.id);

//   if ( index === false ) {
//     req.flash("error-msg", "DELETE UNSUCCESSFUL, ID does not exist");
//     res.redirect(303, '/products');
//   } else {
//     productsArr.splice(index, 1);
//     res.redirect(303, '/products');
//   }
// });




module.exports = router;