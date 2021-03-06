const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mid = require('../middleware');

// GET /profile
router.get('/profile', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('profile', {title: 'Profile', name: user.name, userWeight: user.userWeight});
      }
    })
})

// GET /logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    //delete session object
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
})
// GET /login
router.get('/login', mid.loggedOut, (req, res, next) => {
  return res.render('login', {title: 'Log In'});
});

//POST /login
router.post('/login', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        let err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    let err = new Error ('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});

// GET / register
router.get('/register', mid.loggedOut, (req, res, next) => {
  return res.render('register', {title: 'Sign Up'});
});

// POST / Register
router.post('/register', (req, res, next) => {
  if (req.body.email &&
      req.body.name &&
      req.body.password &&
      req.body.userWeight &&
      req.body.confirmPassword) {
        //confirme that user typed same password twice
        if (req.body.password !== req.body.confirmPassword){
          let err = new Error('Passwords do not match.');
          err.status = 400;
          return next(err);
        }

        //create object with form input
        const userData = {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password,
          userWeight: req.body.userWeight
        };

        //use schema's 'create' method to insert document into mongo
        User.create(userData, (error, user) => {
          if (error) {
            return next(error);
          } else {
            req.session.userId = user._id;
            return res.redirect('/profile');
          }
        });

      } else {
        let err = new Error('All fields required.');
        err.status = 400;
        return next(err);
      }
});
// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});

// GET /workOuts
router.get('/workOuts', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('workOuts', {title: 'WorkOuts', name: user.name});
      }
    })
})

// GET /beginnerGorilla
router.get('/beginnergorilla', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('beginnergorilla', {title: 'BeginnerGorilla', name: user.name});
      }
    })
})

// GET /beginnerMonkey
router.get('/beginnermonkey', mid.requiresLogin, (req, res, next) => {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.render('beginnermonkey', {title: 'BeginnerMonkey', name: user.name});
      }
    })
})
module.exports = router;
