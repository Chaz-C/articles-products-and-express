const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const fs = require('fs');

const products = require('./routes/productsroutes');
const articles = require('./routes/articlesroutes');

const hbs = handlebars.create({
  extname: '.hbs',
  defaultLayout: 'app'
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');


app.use(bodyParser.urlencoded({ extended: true}));

app.use(methodOverride('_method'));

app.use(cookieParser('keyboard cat'));
  app.use(session({ cookie: { maxAge: 60000 }}));
  app.use(flash());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


app.use(function (req, res, next) {

  let date = new Date();
  let month = new Date().getMonth();
  if ( month === 0 ) {
    month = '01';
  }
  let currentDate = `${date.getFullYear()}-${month}-${date.getDate()}`;
  let currentTime = `${date.getHours()}.${date.getMinutes()}.${
    date.getSeconds()}`;

  let data = `[ ${req.method} ] [ ${req.originalUrl} ] [ ${currentDate}_${currentTime} ]\n`;

  fs.appendFile(`./logs/${currentDate}.log`, data, (err) => {
    if (err) throw err;
  });
  next();
});


app.use('/articles', function (req, res, next) {
  if ( req.headers.hasOwnProperty('version') && req.headers.version === '1.0' ) {
    next();
  } else if (req.headers.hasOwnProperty('version') === false ) {
    next();
  } else {
    res.send({ "error": "bad headers" });
  }
});

app.get('/', (req,res) => {
  res.render('index');
});

app.use('/products', products);
app.use('/articles', articles);


module.exports = app;