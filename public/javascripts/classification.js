/* support function
 * recursively inspects the tree, taking decisions
 */
function classify(record, params) {
    var tree = params.tree;
    var val = params.val;
    var app;
    if(tree.type == "parameter") {
        var attrib = record[tree.label];
        for(var k in tree.subtrees){
            app = classify(record, {"tree": tree.subtrees[k], "val": attrib});
            if(app != null) return app;
        }
    }
    if(tree.type == "option" && tree.label == val) {
        for(var k in tree.subtrees){
            app = classify(record, {"tree": tree.subtrees[k], "val": null});
            if(app != null) return app;
        }
    }
    if(tree.type == "leaf") {
        return tree.label;
    }
    return null;
}


/* given a new record and a classification tree,
 * returns the record with the classification value
 * a classification tree is like
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
 *  }
 */
var classify_record = function(tree, new_record) {
    var record = clone(new_record);
    record.classification = classify(record, {"tree": tree, "val": null});
    return record;
};
