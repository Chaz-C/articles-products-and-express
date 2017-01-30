const PG_PASS = process.env.PG_PASS;
const pgp = require('pg-promise')();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'articles_products_express',
  user: '',
  password: ''
});


function getAllArticles() {
  return db.any('SELECT * FROM articles');
}

function getArticleByUrTitle(urlTitle) {
  console.log('---url title---', urlTitle);
  return db.one(`SELECT * FROM articles WHERE articles.url_title = '${encodeURIComponent(urlTitle)}'`);
}

function postArticle(newArticle) {
  console.log('---POST---', newArticle);
  return db.none(`INSERT INTO articles (title, body, author, url_title) VALUES ('${newArticle.title}', '${newArticle.body}', '${newArticle.author}', '${encodeURIComponent(newArticle.title)}')`);
}

function articlePut(newArticleValues, urlTitle) {

  let updatedArticle;

  return db.one(`SELECT * FROM articles WHERE articles.url_title = '${encodeURIComponent(urlTitle)}'`)
  .then( results => {

    let oldArticle = results;

    updatedArticle = Object.assign(oldArticle, newArticleValues);

    return db.none(`UPDATE articles SET title = '${updatedArticle.title}', body = '${updatedArticle.body}', author = '${updatedArticle.author}', url_title = '${encodeURIComponent(updatedArticle.title)}' WHERE articles.url_title = '${encodeURIComponent(urlTitle)}'`);

  })
  .then( function() {

    console.log('---updated article---', updatedArticle);

    return db.one(`SELECT * FROM articles WHERE articles.id = '${updatedArticle.id}'`);
  });
}

function deleteArticle(urlTitle) {

  return db.one(`SELECT * FROM articles WHERE articles.url_title = '${encodeURIComponent(urlTitle)}'`)
  .then( results => {
    return db.none(`DELETE FROM articles WHERE articles.url_title = '${encodeURIComponent(urlTitle)}'`);
  });
}

module.exports = {
  getAllArticles : getAllArticles,
  getArticleByUrTitle : getArticleByUrTitle,
  postArticle : postArticle,
  articlePut : articlePut,
  deleteArticle : deleteArticle
};

//encodeURICompenent();