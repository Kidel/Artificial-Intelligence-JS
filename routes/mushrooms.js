var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var mushroomsModel = require('../models/mushrooms');
var mushrooms = mongoose.model('mushrooms');

/* GET home page. */
router.get('/', function(req, res, next) {
    mushrooms.find({}).exec(function(err, data) {
        res.json(data);
    });
});

module.exports = router;
