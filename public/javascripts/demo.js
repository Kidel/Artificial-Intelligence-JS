function mushroom_demo() {
    document.getElementById("status").innerHTML += display_time() + "Calculating simulated annealing...<br />";
    document.getElementById("simulatedannealing").innerHTML = simulated_annealing_simple(queens_puzzle, example_options).toString();
    document.getElementById("status").innerHTML += display_time() + "Done!<br />";

    document.getElementById("status").innerHTML += display_time() + "Loading the database...<br />";
    getJSON("../mushrooms/", function(err, data) {
        if (err != null)
            document.getElementById("status").innerHTML += display_time() + "Something went wrong with the DB: " + err + "<br />";
        else {
            document.getElementById("status").innerHTML += display_time() + "Database loaded!<br />";
            var mushroom_examples = data;

            document.getElementById("status").innerHTML += display_time() + "Learning...<br />";
            var mushroom_attributes = remove_attribute(Object.keys(mushroom_examples[0]), "classification");
            var mushroom_tree = prism_simple(mushroom_examples, mushroom_attributes, '?');
            document.getElementById("prismtree").innerHTML = syntaxHighlight(mushroom_tree);
            document.getElementById("status").innerHTML += display_time() + "Done!<br />";
            document.getElementById("status").innerHTML += display_time() + "Doing validations...<br />";
            var mushroom_validation_prism = cross_validation(mushroom_examples, 10, prism_simple);
            var mushroom_validation_c4_5 = cross_validation(mushroom_examples, 10, c4_5_simple);
            document.getElementById("prismstats").innerHTML = " - Cross Validation: " + mushroom_validation_prism;
            document.getElementById("c4_5stats").innerHTML = " - Cross Validation: " + mushroom_validation_c4_5;
            document.getElementById("status").innerHTML += display_time() + "Done!<br />";
        }

    });
}

mushroom_demo();
