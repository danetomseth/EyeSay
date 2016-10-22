'use strict';
var router = require('express').Router();
module.exports = router;



router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/threads', require('./threads'));
router.use('/words', require('./predictions'));
router.use('/blinkdata', require('./data'));


function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: 'Something failed!' });
  } else {
  	res.status(404).json(404, err);
    //next(err);
  }
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json(err);
}

//router.use(clientErrorHandler);

// Make sure this is after all of
// the registered routes!


router.use(errorHandler);

router.use(function (req, res) {
    res.status(404).end();
});
