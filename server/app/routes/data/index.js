'use strict';
const router = require('express').Router();
module.exports = router;
const mongoose = require('mongoose');
const BlinkData = mongoose.model('BlinkData');

// no auth
router.get('/', (req, res) => {  // get all
    
});

// ensure authenticated
router.post('/', (req, res) => { // create new
    console.log("posting", req.body);
    BlinkData.create(req.body)
    .then(data => {
        console.log("data recorded", data);
    })
   
});

// ensure owner or admin is viewing
router.get('/:id', (req, res) => { // get one...outside of context of thread
    BlinkData.findById(req.params.id)
    .then(BlinkData => {
            res.send(BlinkData)
    })
});

// ensure owner or admin
router.put('/:id', (req, res) => { // edit one
    BlinkData.findById(req.params.id)
    .then(BlinkData => {
        for (let key in req.body){ // doesn't require sending the whole object back and forth
            BlinkData[key] = req.body[key]
        }
        // BlinkData = req.body // requires sending the whole object, but maybe less risky than overwriting the whole object?
        return BlinkData.save()
    })
    .then(thingToSend => res.send(thingToSend))
});
