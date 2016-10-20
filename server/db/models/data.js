//'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    blinkRatio: {
        type: Number,
        default: 0
    },
    blinkZero: {
        type: Number,
        default: 0
    },
    blinkProfile: {
        type: Array,
        default: []
    },
    user: {
        type: String,
        default: 'User'
    }
})


schema.methods.recordBlink = function(ratio, zero, profile, user) {
    // Add friend if not already in friend array
    this.blinkRatio = ratio;
    this.blinkZero = zero;
    this.blinkProfile = profile;
    this.user = user;

    return this.save();
};

// Hooks

// Virtuals

// Statics

// Methods

mongoose.model('BlinkData', schema);