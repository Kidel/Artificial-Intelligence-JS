/* given a learning set, a test set and an algorithms
 * returns the success rate of that algorithm on that test set
 */
var base_validation = function(learning_set, test_set, classification_algorithm){
    if(test_set.length == 0) return null;
    var attribs = remove_attribute(Object.keys(test_set[0]), "classification");
    var tree = classification_algorithm(learning_set, attribs, "");

    var generated_from_tests = [];
    var test_set_no_class = clone(test_set);

    var success = 0;
    var total = test_set.length;

    for(var i in test_set_no_class) {
        delete test_set_no_class[i]['classification'];
        generated_from_tests[i] = classify_record(tree, test_set_no_class[i]);

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
 * full example set is used, but there is no peeking
 */
var cross_validation = function(examples, segment_number, classification_algorithm){
    console.log("cross validation on " + examples.length + " lines divided in " + segment_number + " segments of " + Math.floor(examples.length/segment_number) + " elements");
    var segment_size = Math.ceil(examples.length/(segment_number));
    var calls = 0;
    var total = 0;
    var best_fold = 0;
    for(var i = 1; i < examples.length; i+=segment_size) {
        var learning_set = examples.slice(0, i).concat(examples.slice(i+segment_size, examples.length)); //not taking the i-esim
        var test_set = examples.slice(i, i+segment_size);
        console.log("learning set size: " + learning_set.length);
        console.log("test set size: " + test_set.length);
        var base = base_validation(learning_set, test_set, classification_algorithm);
        if(base!=null) {
            if(base>best_fold) best_fold = base;
            console.log("" + Math.ceil(i / segment_size) + ": " + base);
            total += base;
            calls++;
        }
    }
    console.log("average: "+ total/calls);
    return [total/calls, best_fold];
};