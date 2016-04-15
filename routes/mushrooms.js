var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

var mushroomsModel = require('../models/mushrooms');
var mushrooms = mongoose.model('mushrooms');

var Helper = require("../modules/helper");
var Learning = require("../modules/learning");
var Validation = require("../modules/validation");

/* GET home page. */
router.get('/', function(req, res, next) {
    mushrooms.find({}).exec(function(err, data) {
        res.json(data);
    });
});

// TODO: not working because of async call
router.get('/prism', function(req, res, next) {
    mushrooms.find({}).exec(function(err, data) {
        var tree = Learning.prism_simple(data, Helper.remove_element(Object.keys(data[0]), "_id"), null);
        res.json(tree);
    });
});

module.exports = router;
