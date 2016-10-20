'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ensure = require('../../configure/authentication/ensure');

// router.param('id', function(req, res, next, id) {
//     User.findById(id).exec()
//         .then(function(user) {
//             if (!user) throw new Error(404);
//             req.requestedUser = user;
//             next();
//         })
//         .catch(next);
// });

// must be logged in
router.get('/', ensure.authenticated, (req, res) => { // get all
    User.find({})
        .then(users => res.send(users))
});

// no auth
router.post('/', (req, res) => { // create new
    User.create(req.body)
        .then(newUser => res.send(newUser))
});

// must be logged in
router.get('/:id', ensure.authenticated, (req, res) => { // get one
    res.json(req.requestedUser);
});

// must be user or admin
router.put('/:id/friends', (req, res) => { // edit one
    User.findById(req.body.id)
        .then((friend) => {
            return req.requestedUser.addFriend(friend._id);
        })
        .then(savedUser => res.send(savedUser))
});


router.put('/update', (req, res) => { // edit one
    User.findById(req.body._id)
        .then(user => {
            console.log('user', user);
            return user.update(user, req.body);
        })
        .then(updatedUser => res.send(updatedUser))
    });

// must be user or admin
router.put('/update/:id', ensure.authenticated, ensure.selfOrAdmin, (req, res) => { // edit one
    User.findById(req.params.id)
        .then(user => {
            console.log('user', user);
            return user.update(user, req.body);
        })
        .then(updatedUser => res.send(updatedUser))
});
