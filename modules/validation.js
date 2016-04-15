var Helper = require("../modules/helper");
var Classification = require("../modules/classification");
var Learning = require("../modules/learning");


/* given a learning set, a test set and an algorithms
 * returns the success rate of that algorithm on that test set
 */
var base_validation = function(learning_set, test_set, classification_algorithm){
    var attribs = Object.keys(test_set[0]);
    attribs = Helper.remove_element(attribs, "classification");
    var tree = classification_algorithm(learning_set, attribs, "");

    var generated_from_tests = [];
    var test_set_no_class = clone(test_set);

    var success = 0;
    var total = test_set.length;

    for(var i in test_set_no_class) {
        delete test_set_no_class[i]['classification'];
        generated_from_tests[i] = Classification.classify_record(tree, test_set_no_class[i]);

        if(generated_from_tests[i].classification == test_set[i].classification)
            success++;
    }
    test_set_no_class = null;

    return success/total;
};


/* given a full set of examples and an algorithms
 * returns the success rate of that algorithm on any learning/test partition based on the segment number
 *
 * calls base_validation multiple times, returning the average.
 * full example set is used, buth there is no peeking
 */
var cross_validation = function(examples, segment_number, classification_algorithm){
    var segment_size = Math.floor(examples.length/segment_number);
    var avg = 0;
    var calls = 0;
    var total = 0;
    for(var i = 0; i < examples.length; i+=segment_size) {
        var learning_set = examples.slice(0, i).concat(examples.slice(i+segment_size, examples.length)); //not taking the i-esim
        var test_set = examples.slice(i, i+segment_size);
        calls++;
        total += base_validation(learning_set, test_set, classification_algorithm);
    }
    return total/calls;
};


var validation = {
    base_validation: base_validation,
    cross_validation: validation
};

module.exports = test;