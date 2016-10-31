'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ensure = require('../../configure/authentication/ensure');

router.use(ensure.authenticated);

// must be logged in
// router.get('/', ensure.authenticated, (req, res, next) => { // get all
//     console.log("getting all users");
//     User.find({})
//         .then(users => res.send(users))
// });

let checkValidId = (id, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error("Invalid User Id");
        }
    } catch (err) {
        next(err)
    }
}

// no auth
router.post('/', (req, res, next) => { // create new
    User.create(req.body)
        .then((newUser, err) => {
            if(err) {
                return next(err);
            }
            res.send(newUser)
    }) 
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
router.put('/update/:id', ensure.authenticated, ensure.selfOrAdmin, (req, res, next) => { // edit one
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        let err = new Error("Invalid User Id");
        return next(err)
    }
    User.findById(req.params.id)
        .then(function(user, err) {
            if (err) {
                return next(err)
            }
            return user.update(user, req.body);
        })
        .then(updatedUser => {
            res.json(updatedUser)
        })
        .catch(err => {
            console.log("error saving!", err);
            next(err)
        }) 

});