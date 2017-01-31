const PG_PASS = process.env.PG_PASS;
const pgp = require('pg-promise')();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'articles_products_express',
  user: '',
  password: ''
});

function stopDuplicates(newArticle){
  return new Promise(function (resolve, reject){
    if ( true ) {
      let DoesItExist = db.none(`SELECT * FROM articles WHERE articles.title = '${newArticle.title}'`);
    resolve(DoesItExist);
    } else {
      reject ( new Error('article already exists') );
    }
  });
}

function articleValidator(newArticle){
  return new Promise(function (resolve, reject){
    if ( newArticle.title !== '' && newArticle.body !== '' && newArticle.author !== '' ) {
    resolve(newArticle);
    } else {
      reject ( new Error('Invalid values') );
    }
  });
}

function getAllArticles() {
  return db.many('SELECT * FROM articles');
}

function getArticleByUrTitle(urlTitle) {
  return db.one(`SELECT * FROM articles WHERE articles.url_title = '${encodeURIComponent(urlTitle)}'`);
}

function postArticle(newArticle) {
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
  stopDuplicates : stopDuplicates,
  articleValidator : articleValidator,
  getAllArticles : getAllArticles,
  getArticleByUrTitle : getArticleByUrTitle,
  postArticle : postArticle,
  articlePut : articlePut,
  deleteArticle : deleteArticle
};

//encodeURICompenent();