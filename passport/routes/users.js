const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load User model
const User = require('../models/user');
const { forwardAuthenticated } = require('../config/auth');

// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Register Page for get request
router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

// Register for Post request
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        // if there is no exists email add new user
        const newUser = new User({
          name,
          email,
          password
        });

        // hash passport
        // genSalt is a method for bcrypt and 10 is number of characters
        bcrypt.genSalt(10, (err, salt) => {
          // hash = plain text to mix. Like call back function
          // a callback to be fired once the salt has been generated. uses eio making it asynchronous. err - First parameter to the callback detailing any errors. salt - Second parameter to the callback providing the generated salt.
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            // set passport to hashed
            newUser.password = hash;
            // save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login POST (http://www.passportjs.org/docs/ Custom Callback)
// Creating Callback According to Our Needs
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
