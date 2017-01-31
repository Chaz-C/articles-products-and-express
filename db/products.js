const PG_PASS = process.env.PG_PASS;
const pgp = require('pg-promise')();
const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'articles_products_express',
  user: '',
  password: ''
});

function stopDuplicates(newProduct){
  return new Promise(function (resolve, reject){
    if ( true ) {
      let DoesItExist = db.none(`SELECT * FROM products WHERE products.name = '${newProduct.name}'`);
    resolve(DoesItExist);
    } else {
      reject ( new Error('article already exists') );
    }
  });
}

function productValidator(newProduct){
  return new Promise(function (resolve, reject){
    if ( newProduct.name !== '' && newProduct.price !== '' && newProduct.inventory !== '' ) {
    resolve(newProduct);
    } else {
      reject ( new Error('Invalid values') );
    }
  });
}

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
  let updatedProduct;
  return db.one(`SELECT * FROM products WHERE products.id = ${oldItemId}`)
  .then( results => {
    let oldProduct = results;
    updatedProduct = Object.assign(oldProduct, newProductValues);
    return db.none(`UPDATE products SET name = '${updatedProduct.name}', price = ${updatedProduct.price}, inventory = ${updatedProduct.inventory} WHERE products.id = ${oldItemId}`);
  })
  .then( function() {
    return db.one(`SELECT * FROM products WHERE products.id = ${updatedProduct.id}`);
  });
}

function deleteProduct(id) {
  return db.one(`SELECT * FROM products WHERE products.id = ${id}`)
  .then( results => {
    return db.none(`DELETE FROM products WHERE products.id = ${id}`);
  });
}

module.exports = {
  stopDuplicates : stopDuplicates,
  productValidator : productValidator,
  getAllProducts : getAllProducts,
  getProductById : getProductById,
  postProduct : postProduct,
  productPut : productPut,
  deleteProduct : deleteProduct
};