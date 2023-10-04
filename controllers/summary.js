const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('summary/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params._id;
  Product.findById(prodId)
    .then(product => {
      res.render('summary/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  req.user.populate('eligible_devices.items._id').execPopulate().then((user) => {
    res.render('summary/index', {
      prods: user.eligible_devices.items,
      pageTitle: 'Summary',
      path: '/'
    });
  }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });    
};
