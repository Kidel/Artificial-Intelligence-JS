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


/* returns the gain value.
 * entropyS: entropy of the classification attribute
 * partial: array with the frequency of each attribute value, for each attribute
 *          like: [attrib1 => ['yes' => 4, 'no' => 5], attrib2 => [...], ...]
 */
var x = true;
var gain_array = function(entropyS, partial) {
    var entropy = [];
    for(var a in partial) {
        entropy[a] = [];
        for(var v in partial[a]){
            entropy[a][v] = 0;
            var total = 0;
            for(var n in partial[a][v])
                total += partial[a][v][n];
            for(var n in partial[a][v]) {
                entropy[a][v] += (-1) * (partial[a][v][n] / total) * base2_log((partial[a][v][n] / total));
            }
            entropy[a][v] = entropyS - entropy[a][v];
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


/* returns an object, like
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
    var classifications = [];
    for(var i in examples) {
        if(typeof classifications[examples[i].classification] == 'undefined') classifications[examples[i].classification] = 0;
        classifications[examples[i].classification]++;
    }
    // Entropy(S)
    var classification_entropy = 0;
    for(var c in classifications) {
        classification_entropy += (-1) * (classifications[c] / total) * base2_log((classifications[c] / total));
    }
    // Gain(S,Si) = Entropy(S) - Sum(Si/S * Entropy(Si), i)
    var attribute_gain = gain_array(classification_entropy, partial);
    //console.log("---------");
    //console.log(attribute_gain);
    var best = {"name": "", "values": []};
    best.name = index_of_best_value(attribute_gain);
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
 * returns: a decision tree, like
 * {
 *   "label": best attribute,
 *   "type": "parameter",
 *   "subtrees": [
 *                 {
 *                   "label": best attribute value i,
 *                   "type": "option",
 *                   "subtrees": [ { "type": "parameter", ... }, ... ],
 *                 },
 *                 {
 *                   "label": best attribute value i,
 *                   "type": "option",
 *                   "subtrees": [ { "label": classification, "type": "leaf", "subtrees": [] } ],
 *                 },
 *                   ...
 *               ],
 * }
 */
var c4_5_simple = function(examples, attrib, def) {
    var global_attrib = clone(attrib);
    if (examples.length == 0) return {"label": def, "type": "leaf", "subtrees": []};
    else if (same_classification(examples)) return {
        "label": examples[0].classification,
        "type": "leaf",
        "subtrees": []
    };
    else if (global_attrib.length == 0) return {
        "label": majority_value(examples),
        "type": "leaf",
        "subtrees": [],
        "note": "majority"
    };
    else {
        var best = chose_attribute(global_attrib, examples);
        var tree = {"label": best.name, "subtrees": [], "type": "parameter"};
        var m = majority_value(examples);
        for (var i in best.values) {
            var examples_i = filter_based_on_attrib_value(best.values[i], best.name, examples);
            global_attrib = remove_attribute(global_attrib, best.name);
            var subtree = {
                "label": best.values[i],
                "subtrees": [c4_5_simple(examples_i, global_attrib, m)],
                "type": "option"
            };
            tree.subtrees.push(subtree);
        }
        return tree;
    }
};