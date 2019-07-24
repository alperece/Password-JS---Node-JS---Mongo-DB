const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

// Dashboard
// we use ensureAuthenticated to have a protected dashboard page
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    // it will write at dashboard welcome "user name" for privacy
    user: req.user
  })
);

module.exports = router;
