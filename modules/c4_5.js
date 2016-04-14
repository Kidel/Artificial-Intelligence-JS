var Helper = require("../modules/helper");

var same_classification = function(examples) {
    var classification = examples[0].classification;
    for(var i in examples) {
        if (classification != examples[i].classification) return false;
    }
    return true;
};

var majority_value = function(examples) {
    var classifications = [];
    for(var i in examples) {
        if(typeof classifications[examples[i].classification] == 'undefined')
            classifications[examples[i].classification] = 1;
        else classifications[examples[i].classification]++;
    }
    var max = -1;
    var major;
    for(var i in array) {
        if(classifications[i] > max) { max = classifications[i]; major = i };
    }
    return major;
};

var remove_attribute = function(array, search_term) {
    for (var i=array.length-1; i>=0; i--) {
        if (array[i] === search_term) {
            array.splice(i, 1);
        }
    }
    return array;
};

var base2_log = function(x) {
    Helper.base2_log(x);
};

var entropy_array = function(partial) {
    var entropy = [];
    for(var k in partial) {
        entropy[k] = 0;
        for(var n in partial[k]){
            entropy[k] += (-1) * base2_log(partial[k][n]);
        }
    }
    return entropy;
};

var index_of_max_value = function(entropy) {
    var max = -1;
    var best = "";
    for(var k in entropy) {
        if(best == "") best = k;
        if(entropy[k]>=max) {
            best = k;
            max = entropy[k];
        }
    }
    return best;
};

var get_possible_values = function(attrib, examples) {
    var vals = [];
    for(var i in examples) {
        vals[examples[i][attrib]] = examples[i][attrib];
    }
    return vals;
};

// returns an object {name: attribute name, values: array with all the possible values}
var chose_attribute = function(attrib, examples) {
    var total = examples.length;
    var partial = [];  // [attrib1 => ["yes" => 2, "no" => 1], ... ]
    for(var i in examples) {
        for(var j in attrib) {
            partial[attrib[j]][examples[i].classification]++;
        }
    }
    var entropy = entropy_array(partial);

    var best = {"name": "", "values": []};

    best.name = index_of_max_value(entropy);
    best.velues = get_possible_values(best, examples);

    return best;
};

var filter_based_on_attrib_value = function(value, attrib_name, examples) {
    var new_examples = [];
    for(var i in examples) {
        if(examples[i][attrib_name]==value)
            new_examples.push(examples[i]);
    }
    return new_examples;
};

/*
* examples: a list of examples from the learning set, like [{attrib1: x, attrib2: y, ... , classification}, ... ]
* attrib: a list of attributes to choose from, like ["attrib1", "attrib2", ... ]
* def: a default value if there are no examples (left), like "yes", or 1.
*
* returns: a decision tree, like {"label": best, "childs": [ .. more trees .. ]}
* */
var c4_5 = function(examples, attrib, def) {
    if(examples.length == 0) return def;
    else if(same_classification(examples)) return examples[0].classification;
    else if(attrib.length == 0) return majority_value(examples);
    else {
        var best = chose_attribute(attrib, examples);
        var tree = {"label": best.name, "childs": []};
        var m = majority_value(examples);
        for(var i in best.values) {
            var examples_i = filter_based_on_attrib_value(best.values[i], best, examples);
            var subtree = c4_5(examples_i[i], remove_attribute(attrib, best.name), m);
            tree.childs.push(subtree);
        }
        return tree;
    }
};


var learning = {
    c4_5: c4_5
};

module.exports = learning;