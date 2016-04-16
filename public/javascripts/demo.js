function mushroom_demo() {
    document.getElementById("status").innerHTML += display_time() + "Calculating simulated annealing...<br />";
    document.getElementById("simulatedannealing").innerHTML = print_queens(simulated_annealing_simple(queens_puzzle, queens_options));
    document.getElementById("status").innerHTML += display_time() + "Done!<br />";
/*
    document.getElementById("status").innerHTML += display_time() + "Calculating genetic algorithm...<br />";
    document.getElementById("geneticalgorithm").innerHTML = print_queens(genetic_algorithm_simple(queens_puzzle, 10, queens_options));
    document.getElementById("status").innerHTML += display_time() + "Done!<br />";
*/
    document.getElementById("status").innerHTML += display_time() + "Loading the mushrooms data set...<br />";
    getJSON("../mushrooms/", function(err, data) {
        if (err != null)
            document.getElementById("status").innerHTML += display_time() + "Something went wrong with the DB: " + err + "<br />";
        else {
            document.getElementById("status").innerHTML += display_time() + "Database loaded!<br />";
            var mushroom_examples = data;

            document.getElementById("status").innerHTML += display_time() + "Learning...<br />";
            var mushroom_attributes = remove_attribute(Object.keys(mushroom_examples[0]), "classification");
            var mushroom_tree_prims = prism_simple(mushroom_examples, mushroom_attributes, '?');
            var mushroom_tree_c4_5 = c4_5_simple(mushroom_examples, mushroom_attributes, '?');
            document.getElementById("prismtree").innerHTML = syntaxHighlight(mushroom_tree_prims);
            document.getElementById("c4_5tree").innerHTML = syntaxHighlight(mushroom_tree_c4_5);
            document.getElementById("status").innerHTML += display_time() + "Done!<br />";
            document.getElementById("status").innerHTML += display_time() + "Doing validations...<br />";
            var mushroom_validation_prism = cross_validation(mushroom_examples, 10, prism_simple);
            document.getElementById("prismstats").innerHTML = "... Cross Validation: " + mushroom_validation_prism;
            var mushroom_validation_c4_5 = cross_validation(mushroom_examples, 10, c4_5_simple);
            document.getElementById("c4_5stats").innerHTML = "... Cross Validation: " + mushroom_validation_c4_5;
            document.getElementById("status").innerHTML += display_time() + "Done!<br />";
        }
    });
}

mushroom_demo();
