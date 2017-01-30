const PG_PASS = process.env.PG_PASS;
const pgp = require('pg-promise')();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'articles_products_express',
  user: '',
  password: ''
});


function getAllProducts() {
  return db.many('SELECT * FROM products');
}

function getProductById(id) {
  return db.one(`SELECT * FROM products WHERE products.id = ${id}`);
}

function postProduct(newProduct) {
  return db.none(`INSERT INTO products (name, price, inventory) VALUES ('${newProduct.name}', ${newProduct.price}, ${newProduct.inventory})`);
}

function productPut(newProductValues, oldItemId) {

  console.log(newProductValues);

      let qs = '';
      let count = 0;

      if ( newProductValues.hasOwnProperty('name') && newProductValues.name !== '' ) {
        qs = `name = '${newProductValues.name}'`;
        count += 1;
      }
      if ( newProductValues.hasOwnProperty('price') && newProductValues.price !== '') {
        if ( count > 0 ) {
          qs += `, price = '${newProductValues.price}'`;
        } else {
          qs = `price = ${newProductValues.price}`;
        }
        count += 1;
      }
      if ( newProductValues.hasOwnProperty('inventory') && newProductValues.inventory !== '') {
        if ( count > 0 ) {
          qs += `, inventory = ${newProductValues.inventory}`;
        } else {
          qs = `inventory = ${newProductValues.inventory}`;
        }
      }

      // console.log(`db.one('UPDATE products SET ${qs} WHERE products.id = ${oldItemId}')`);

  return db.none(`UPDATE products SET ${qs} WHERE products.id = ${oldItemId}`);
}

function deleteProduct(id) {
  return db.none(`DELETE FROM products WHERE products.id = ${id}`);
}

module.exports = {
  getAllProducts : getAllProducts,
  getProductById : getProductById,
  postProduct : postProduct,
  productPut : productPut,
  deleteProduct : deleteProduct
};