
const mailhandler = require('../util/mailhandler');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const fileReader = require('../util/file_reader');
const Product = require('../models/product');
const ejs = require('ejs');


exports.getVerify = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  User.countDocuments({}, async function(err, count){
    if(count < 1) {
      try {
      await fileReader.readFile(true);
      } catch(error) {
        console.log(error);
        errorMessage = error;
        res.redirect('/verify');
      }
    }
  });

  Product.countDocuments({}, async function(err, count){
    if(count < 1) {
      try {
      await fileReader.readFile(false);
      } catch(error) {
        console.log(error);
        errorMessage = error;
        res.redirect('/verify');
      }
    }
  });
  
  res.render('auth/verify', {
    path: '/verify',
    pageTitle: 'Verify',
    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.postVerify = (req, res, next) => {
  const name = req.body.name.toString().toLowerCase();
  const email = req.body.email;
  const phone = req.body.phone;
  const ID = req.body.ID;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/verify', {
      path: '/verify',
      pageTitle: 'Verify',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        name: name,
        email: email,
        phone: phone,
        ID: ID
      },
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(async user => {
      if (!user) {
        return res.status(422).render('auth/verify', {
          path: '/verify',
          pageTitle: 'Verify',
          errorMessage: 'Invalid email.',
          oldInput: {
            name: name,
            email: email,
            phone: phone,
            ID: ID
          },
          validationErrors: []
        });
      }
      const { _csrf, ...userDetails } = Object.assign({}, req.body);
      const { _id, __v, eligibility_checked, eligibility_details, eligible_devices, ...storedDetails } = Object.assign({}, Object.values(user)[5]);
      if(JSON.stringify(userDetails) === JSON.stringify(storedDetails)) {
        req.session.isisVerified = true;
        req.session.user = user;
        if(!Object.keys(Object.values(user)[5]).includes('eligibility_checked')) {
          Product.find().then((result) => {
            user.checkEligibleDevice(result).then((updatedList) => {
              User.findOneAndUpdate({_id: user._id}, {eligibility_checked: true}, { new: true }).then((updatedResult) => {
                user.save().then((savedUser) => {
                  const eligible_devices = result.filter((device) => {
                    return savedUser.eligible_devices.items.some((eligible_device) => {
                      return device._id.toString() === eligible_device._id.toString();
                    });
                  });
                  if(eligible_devices.length > 0 ) {
                    const mailTemplate = ejs.renderFile('./views/summary/mailTemplate.ejs', {user: savedUser, devices: eligible_devices});
                    mailTemplate.then((renderedPage) => {
                      mailhandler.sendMail(savedUser.email, 'Your Eligibility summary.', renderedPage);
                  });
                }
                });
              }).catch(err => {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
              });
            });
          });
      }
        return req.session.save(err => {
          console.log(err);
          res.redirect('/');
      });
    }
        return res.status(422).render('auth/verify', {
          path: '/verify',
          pageTitle: 'Verify',
          errorMessage: 'Some details are invalid or wrong.',
          oldInput: {
            name: name,
            email: email,
            phone: phone,
            ID: ID
          },
          validationErrors: []
        });
      })
        .catch(err => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
};


exports.postExit = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReport = (req, res, next) => {
//this does not calculate the user who are eligible for a device,
//but users from the user data who have enrolled verification process, as requested.

  User.find().then((allUsers) => {
     const totalUsers = allUsers.length;
     const totalEnrolled = allUsers.filter((user) => {
        return Object.keys(Object.values(user)[5]).includes('eligibility_checked');}).length;
     const enrollmentPercentage = (totalEnrolled / totalUsers)*100;
     return res.render('auth/report', {
      path: '/report',
      pageTitle: 'Report',
      totalUsers: totalUsers,
      totalEnrolled: totalEnrolled,
      enrollmentPercentage: enrollmentPercentage
    });
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

}
