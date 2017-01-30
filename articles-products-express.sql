-- DROP DATABASE IF EXISTS articles_products_express;
CREATE DATABASE articles_products_express;

\c articles_products_express;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
  id serial PRIMARY KEY NOT NULL,
  name text NOT NULL,
  price integer NOT NULL,
  inventory integer NOT NULL
);

DROP TABLE IF EXISTS articles;
CREATE TABLE articles (
  id serial PRIMARY KEY NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  author text NOT NULL,
  url_title text NOT NULL
);