const MongoDB = require('mongodb')

// Let us use ObjectId. It is not needed for this exercise, but I keep it to have it for the future
var ObjectId = require('mongodb').ObjectId
const users = 'users'
const products = 'products'
const shoppingCart = 'shoppingCart'

class Database {
  constructor ({ host, database }) {
    this.url = `mongodb://${host}/${database}`
  }

  // I have changed {} for { if (error) callback(error) } because eslint was
  // showing "handle-callback-err"
  connect (callback = (error, database) => { if (error) callback(error) }) {
    if (this.database) {
      callback(null, this.database)
    } else {
      MongoDB.MongoClient.connect(this.url, (error, database) => {
        if (error) {
          callback(error)
        } else {
          this.database = database
          callback(null, this.database)
        }
      })
    }
  }

  close (callback = (error) => { if (error) callback(error) }) {
    if (this.database) {
      this.database.close(true, callback)
    } else {
      callback()
    }
  }
  // Insert a user
  // user is the object to insert into the collection
  // callback has two arguments error and result
  insertUser (user, callback = (error, result) => { if (error) callback(error) }) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        // LAB 1
        // Implement the query to insert a user
        // user is the document that we want to insert
        // remember once it's finish to comment callback('Error inserting user');
        database.collection(users).insertOne(user, callback)

        // callback('Error inserting user');
      }
    })
  }

  listUsers (callback = (error, users) => { if (error) callback(error) }) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        //  LAB 2
        // Implement the query to insert a user
        // remeber once it's finish to comment callback('Error listing users');
        database.collection(users).find(callback)

        // callback('Error listing users');
      }
    })
  }

  deleteUser (firstName, callback = (error, result) => { if (error) callback(error) }) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        //  LAB 3
        // Implement the query to delete a user
        // firstName is the name of user that we want to delete
        // remeber once it's finish to comment callback('Error deleting user');

        database.collection(users).deleteOne({'firstName': firstName}, callback)

        // callback('Error deleting user');
      }
    })
  }

  insertProduct (product, callback = (error, result) => { if (error) callback(error) }) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        // LAB 4
        // Implement the query to insert a product
        // product is the document to insert
        // remeber once it's finish to comment callback('Error inserting product');

        database.collection(products).insertOne(product, callback)

        // callback('Error inserting product');
      }
    })
  }

  listProducts (callback = (error, products) => { if (error) callback(error) }) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        // LAB 5
        // Implement the query to list all products
        // remeber once it's finish to comment callback('Error listing products');

        database.collection(products).find(callback)

        // callback('Error listing products');
      }
    })
  }

  deleteProduct (productName, callback = (error, result) => { if (error) callback(error) }) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        // LAB 6
        // Implement the query to delete a product
        // productName is the name of the producto to delete
        // remeber once it's finish to comment callback('Error deleting product');

        console.log(productName)
        database.collection('products').deleteOne({'name': productName}, callback)

        // callback('Error deleting product');
      }
    })
  }

  addProductToShoppingCart ({userFirstName, productName}, callback = (error) => { if (error) callback(error) }) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        // LAB 7
        // Implement the query to buy a product
        // userFirstName is the name of user who purchase the product
        // productName is the name of the product that we want to buy
        // Think if you may need to implement two queries chained
        // remeber once it's finish to comment callback('Error buying product');

        // Use a callback after findOne to updateOne. The callback assigns the result of
        // findOne to "doc" in order to use it inside the callback.
        database.collection(products).findOne({'name': productName}, (error, doc) => {
          if (error) {
            callback(error)
          }

          // Instead of using ObjectId(doc._id.toString()) I could use only doc._id, but
          // I keep it this way to remember the ObjectId constructor and the toString() method
          database.collection(users).updateOne({'firstName': userFirstName},
            {$push: {shoppingCart: {'product_id': ObjectId(doc._id.toString()), 'units': 4}}}, callback)
        })

        // callback('Error buying product');
      }
    })
  }

  addReviewToProduct ({productName, review}, callback = (messageResult) => {}) {
    this.connect((error, database) => {
      if (error) {
        callback(error)
      } else {
        // LAB 8
        // Implement the query to review a product
        // productName is the name of the product to review
        // review is the document to insert
        // remeber once it's finish to comment callback('Error reviewing product');

        database.collection(products).updateOne({'name': productName},
          {$push: {'review': review}}, callback)

        // callback('Error reviewing product')
      }
    })
  }
}

module.exports = Database
