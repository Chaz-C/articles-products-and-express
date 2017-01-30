const express = require('express');
const router = express.Router();
const app = express();

const articles = require('../db/articles');


router.get('/new', (req, res) => {
  res.render('new.hbs', { articles: true, messages: res.locals.messages()} );
});

router.get('/', (req, res) => {
  articles.getAllArticles()
  .then( results => {
    res.render('index', { articles: results, messages: res.locals.messages() });
  })
  .catch( error => {
    console.log(error);
  });
});

router.get('/:title/edit', (req, res) => {
  articles.getArticleByUrTitle(req.params.title)
  .then( results => {
    res.render('edit.hbs', { articlesObj: results, articles: true, messages: res.locals.messages() } );
  })
  .catch( error => {
    console.log(error);
    req.flash("error-msg", `"${req.params.title}"" does not exist`);
    res.redirect(303, '/articles/new');
  });
});

router.get('/:title', (req, res) => {
  articles.getArticleByUrTitle(req.params.title)
  .then( results => {
    res.render('article.hbs', { articles: results, messages: res.locals.messages() } );
  })
  .catch( error => {
    console.log('---GET/TITLE---', error);
  });
});


router.post('/', (req, res) => {
  let newArticle = req.body;

    if ( newArticle.hasOwnProperty('title') && newArticle.hasOwnProperty('body') &&
      newArticle.hasOwnProperty('author') && newArticle.title !== '' && newArticle.body !== '' && newArticle.author !== '' ) {

      articles.postArticle(newArticle)
      .then(function () {
        res.redirect('/articles');
      })
      .catch( error => {
        req.flash("error-msg", "POST UNSUCCESSFUL Invaltitle property or value");
        res.redirect('/articles/new');
      });

    } else {
      req.flash("error-msg", "POST UNSUCCESSFUL Invaltitle property or value");
      res.redirect('/articles/new');
    }
});

router.put('/:title', (req, res) => {
  let newArticleValues = req.body;

  articles.articlePut(newArticleValues, req.params.title)
  .then( results => {

    console.log('---PUT---', results);
    res.redirect(303, `/articles/${results.url_title}`);
  })
  .catch( error => {

    console.log('---PUT ERROR ---', error);
    if ( error.received === 0 ) {
      req.flash("error-msg", `"${req.params.title}"" does not exist`);
      res.redirect(303, '/articles/new');
    } else {
      req.flash("error-msg", "PUT UNSUCCESSFUL Invalid property or value");
      res.redirect(303, `/articles/${req.params.title}/edit`);
    }
  });
});

router.delete('/:title', (req, res) => {

    articles.deleteArticle(req.params.title)
    .then( results =>  {
      console.log('---DELETE RESULTS---', results);
      req.flash("success-msg", "DELETE SUCCESSFUL!!");
      res.redirect(303, '/articles');
    })
    .catch( err => {
      console.log(err);
      req.flash("error-msg", "DELETE UNSUCCESSFUL, title does not exist");
      res.redirect(303, '/articles');
    });
});


module.exports = router;