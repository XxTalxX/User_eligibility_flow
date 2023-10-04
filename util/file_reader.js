const bfj = require('bfj');
const fs = require('fs');

//file said to contain millions of users, so using stream to read large file and save to database user by user.

const User = require('../models/user');
const Product = require('../models/product');
let products = [];

async function readFile(readUsers = true) {
    return new Promise((resolve) => {
    const stream = fs.createReadStream(readUsers ? './data/users.json' : './data/products.json');
    bfj.match(stream, (key, value, depth) => depth === 1, { ndjson: true })
    .on('data', object => {
        if(readUsers) {
        object.name = object.name.toString().toLowerCase();
        const user = new User(object);
        User.exists({ID: object.ID}).then((exists) => {
           if(!exists) {
            resolve(user.save());
           } 
        }); } else { products.push(object); }
    })
    .on('dataError', error => {
        console.log('error in file ' + error);
    })
    .on('error', error => {
        console.log('operational error ' + error);
    })
    .on('end', error => {
        if(error) console.log(error);
        if(!readUsers) {
            console.log("xxxx");
            products.forEach((device) => {
           Product.exists({title: device.title}).then((exists) => {
            if(!exists) {
                const product = new Product({
                    title: device.title,
                    price: device.price,
                    description: device.description,
                    imageUrl: device.imageUrl,
                    eligibility_score: device.eligibility_score
                  })
                  product.save().then((result) => {
                  }).catch((err) => {
                      const error = new Error(err);
                      error.httpStatusCode = 500;
                      return next(error);
                  });
            }
           }).catch(err => console.log(err));    
            });
            resolve(products);
        } 
    });
    })
  
}

exports.readFile = readFile
exports.products = products
