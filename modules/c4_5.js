var Helper = require("../modules/helper");

/* checks if all examples give the same outcome
 */
var same_classification = function(examples) {
    var classification = examples[0].classification;
    for(var i in examples) {
        if (classification != examples[i].classification) return false;
    }
    return true;
};

/* returns the most frequent outcome
 */
var majority_value = function(examples) {
    var classifications = [];
    for(var i in examples) {
        if(typeof classifications[examples[i].classification] == 'undefined')
            classifications[examples[i].classification] = 1;
        else classifications[examples[i].classification]++;
    }
    var max = -1;
    var major;
    for(var i in classifications) {
        if(classifications[i] > max) { max = classifications[i]; major = i };
    }
    return major;
};

/* returns the array with one element removed
 */
var remove_attribute = function(attrib, to_remove) {
    var array = attrib.slice(0);
    for (var i=array.length-1; i>=0; i--) {
        if (array[i] === to_remove) {
            array.splice(i, 1);
        }
    }
    return array;
};

var base2_log = function(x) {
    Helper.base2_log(x);
};

/* returns the entropy value.
 * total: number of total elements
 * partial: array with the frequency of each attribute value, for each attribute
 *          like: [attrib1 => ['yes' => 4, 'no' => 5], attrib2 => [...], ...]
 *          [attrib1 => [val1 => ["yes" => 2, "no" => 1], val2 => ...], attrib2 => ... ]
 */
var entropy_array = function(partial, total) {
    var entropy = [];
    for(var a in partial) {
        entropy[a] = [];
        for(var v in partial[a]){
            entropy[a][v] = 0;
            for(var n in partial[a][v]) {
                entropy[a][v] += (-1) * base2_log((partial[a][v][n] / total));
            }
        }
    }
    return entropy;
};

/* selects the best attribute based on its entropy
 */
var index_of_best_value = function(entropy) {
    var min = 10; // entropy can be 0 at best
    var best = "";
    for(var a in entropy) {
        if(best == "") best = a;
        for(var v in entropy[a]) {
            if(entropy[a][v] <= min) {
                best = a;
                min = entropy[a][v];
            }
        }
    }
    return best;
};

/* returns an array that contains all the possible values corresponding to an example attribute.
 * both as key and value, like: ['yes' => 'yes', 'maybe' => 'maybe', ... ]
 */
var get_possible_values = function(attrib, examples) {
    var vals = [];
    for(var i in examples) {
        vals[examples[i][attrib]] = examples[i][attrib];
    }
    return vals;
};

/* returns the best attribute to choose as an object, like
* {
*   name: attribute name,
*   values: array with all the possible values in examples for that attribute
* }
* */
var chose_attribute = function(attrib, examples) {
    var total = examples.length;
    var partial = [];  // will look like [attrib1 => ["yes" => 2, "no" => 1], ... ]
    for(var i in examples) {
        for(var j in attrib) {
            if(typeof partial[attrib[j]] == 'undefined') partial[attrib[j]] = [];
            if(typeof partial[attrib[j]][examples[i][attrib[j]]] == 'undefined') partial[attrib[j]][examples[i][attrib[j]]] = [];
            if(typeof partial[attrib[j]][examples[i][attrib[j]]][examples[i].classification] == 'undefined') partial[attrib[j]][examples[i][attrib[j]]][examples[i].classification] = 0;
            partial[attrib[j]][examples[i][attrib[j]]][examples[i].classification]++;
        }
    }
    var entropy = entropy_array(partial, total);
    var best = {"name": "", "values": []};
    best.name = index_of_best_value(entropy);
    best.values = get_possible_values(best.name, examples);

    return best;
};

/* returns an example list but only with the line corresponding to value in the attrib_name column
 */
var filter_based_on_attrib_value = function(value, attrib_name, examples) {
    var new_examples = [];
    for(var i in examples) {
        if(examples[i][attrib_name]==value)
            new_examples.push(examples[i]);
    }
    return new_examples;
};

/* Simple C4.5
* examples: a list of examples from the learning set, like [{attrib1: x, attrib2: y, ... , classification}, ... ]
* attrib: a list of attributes to choose from, like ["attrib1", "attrib2", ... ]
* def: a default value if there are no examples (left), like "yes", or 1.
*
* returns: a decision tree, like {"label": best, "childs": [ .. more trees .. ]}
* */
var c4_5_simple = function(examples, attrib, def) {
    var global_attrib = attrib; // c4.5 when a column is removed, it can't be reused for any call
    var c4_5_simple = function(examples, def) {
        if(examples.length == 0) return def;
        else if(same_classification(examples)) return examples[0].classification;
        else if(global_attrib.length == 0) return majority_value(examples);
        else {
            var best = chose_attribute(global_attrib, examples);
            var tree = {"label": best.name, "childs": []};
            var m = majority_value(examples);
            for(var i in best.values) {
                var examples_i = filter_based_on_attrib_value(best.values[i], best.name, examples);
                var new_attrib = remove_attribute(global_attrib, best.name);
                global_attrib = new_attrib;
                var subtree = c4_5_simple(examples_i, new_attrib, m);
                tree.childs.push(subtree);
            }
            return tree;
        }
    };
    return c4_5_simple(examples, def);
};


var learning = {
    c4_5_simple: c4_5_simple
};

module.exports = learning;