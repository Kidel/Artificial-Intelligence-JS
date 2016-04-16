function mushroom_demo() {
    getJSON("../mushrooms/", function(err, data) {
        if (err != null)
            console.log("Something went wrong: " + err);
        var mushroom_examples = data;
        var mushroom_attributes = remove_attribute(Object.keys(mushroom_examples[0]), "classification");
        var mushroom_tree = prism_simple(mushroom_examples, mushroom_attributes, '?');
        var mushroom_validation_prism = cross_validation(mushroom_examples, 10, prism_simple);
        var mushroom_validation_c4_5 = cross_validation(mushroom_examples, 10, c4_5_simple);

        document.getElementById("prismtree").innerHTML = syntaxHighlight(mushroom_tree);
        document.getElementById("prismstats").innerHTML = " - Cross Validation: " + mushroom_validation_prism;
        document.getElementById("c4_5stats").innerHTML = " - Cross Validation: " + mushroom_validation_c4_5;
    });
}

mushroom_demo();
