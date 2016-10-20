'use strict';
var router = require('express').Router();
module.exports = router;



router.use('/posts', require('./posts'));
router.use('/users', require('./users'));
router.use('/threads', require('./threads'));
router.use('/words', require('./predictions'));
router.use('/blinkdata', require('./data'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
