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

router.get('/:title/edit', (req, res) => {
  let index = findIndex(req.params.title);
  res.render('edit.hbs', { articlesArr: articlesArr[index], articles: true, messages: res.locals.messages() } );
});

router.get('/:title', (req, res) => {
  let index = findIndex(req.params.title);
  res.render('article', articlesArr[index]);
});


router.post('/', (req, res) => {
  let newArticle = req.body;

  let doesItExist = findIndex(req.body.title);

  if ( doesItExist !== false ) {
    req.flash("error-msg", "article title already exists");
    res.redirect(303, '/articles/new');
  } else {
    if ( newArticle.hasOwnProperty('title') && newArticle.hasOwnProperty('body') &&
      newArticle.hasOwnProperty('author') && newArticle.title !== '' && newArticle.body !== '' && newArticle.author !== '' ) {
      let createUrlTitle =
      newArticle.urlTitle = `${encodeURIComponent(newArticle.title)}`;
      articlesArr.push(newArticle);
      res.redirect('/articles');
    } else {
      req.flash("error-msg", "POST UNSUCCESSFUL Invaltitle property or value");
      res.redirect('/articles/new');
    }
  }

});

router.put('/:title', (req, res) => {
  let index = findIndex(req.params.title);
  let newArticleValues = req.body;
  let editArticle = articlesArr[index];
  if ( index === false ) {
    req.flash("error-msg", `"${req.params.title}"" does not exist`);
    res.redirect(303, '/articles');
  }
  if ( newArticleValues.hasOwnProperty('title') || newArticleValues.hasOwnProperty('body') || newArticleValues.hasOwnProperty('author') ) {

        if ( newArticleValues.hasOwnProperty('title') && newArticleValues.title !== '' ) {
          editArticle.title = newArticleValues.title;
        }
        if ( newArticleValues.hasOwnProperty('body') && newArticleValues.body !== '') {
          editArticle.body = newArticleValues.body;
        }
        if ( newArticleValues.hasOwnProperty('author') && newArticleValues.author !== '') {
          editArticle.author = newArticleValues.author;
        }
          res.redirect(303, `/articles/${req.params.title}`);
    } else {
      req.flash("error-msg", "PUT UNSUCCESSFUL Invalid property or value");
      res.redirect(303, `/articles/${req.params.title}/edit`);
  }
});

router.delete('/:title', (req, res) => {
  let index = findIndex(req.params.title);

  if ( index === false ) {
    req.flash("error-msg", "DELETE UNSUCCESSFUL, title does not exist");
    res.redirect(303, '/articles');
  } else {
    articlesArr.splice(index, 1);
    res.redirect(303, '/articles');
  }
});




module.exports = router;