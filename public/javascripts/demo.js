function mushroom_demo() {
    getJSON("../mushrooms/", function(err, data) {
        if (err != null)
            console.log("Something went wrong: " + err);
        var mushroom_examples = data;
        var mushroom_attributes = remove_attribute(Object.keys(mushroom_examples[0]), "classification");
        var mushroom_tree = prism_simple(mushroom_examples, mushroom_attributes, '?');
        var mushroom_validation = cross_validation(mushroom_examples, 10, prism_simple);

        document.getElementById("prismtree").innerHTML = JSON.stringify(mushroom_tree)
        document.getElementById("prismstats").innerHTML = "Cross Validation: " + mushroom_validation;
    });
}

mushroom_demo();
