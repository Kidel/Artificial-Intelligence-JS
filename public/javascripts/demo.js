// example problem
var queens_puzzle = {};
queens_puzzle.name = "queens puzzle";
queens_puzzle.size = 20;
queens_puzzle.get_initial_node = function(){
    var arr = [];
    for(var i = 0; i< queens_puzzle.size; i++){
        arr[i] = i;
    }
    return arr;
};
queens_puzzle.randomswap = function(c1, node){
    var arr = clone(node);
    var c2 = Math.floor((Math.random() * (node.length)));
    var app = arr[c1];
    arr[c1] = arr[c2];
    arr[c2] = app;
    return arr;
};
queens_puzzle.create_random_node = function() {
    var arr = queens_puzzle.get_initial_node();
    //random perturbation
    for(var j=0; j<100; j++) {
        for (var i=0; i<arr.length; i++) {
            arr = queens_puzzle.randomswap(i, arr);
        }
    }
    return arr;
};
queens_puzzle.select_random_successor = function(node) {
    var app = clone(node);
    // randomly swap 2 columns
    var rand_index = Math.floor((Math.random() * (node.length)));
    return queens_puzzle.randomswap(rand_index, app);
};
queens_puzzle.evaluate = function(node) {
    var conflicts = 0;
    // for each column/queen
    for(var c=0; c<node.length; c++){
        // and again for each column
        for(var j=0; j<node.length; j++){
			if(c!=j && node[c]==node[j]) conflicts++
            if(c!=j && (Math.abs(c-j)==Math.abs(node[c]-node[j]))) conflicts++
        }
    }
    return ((-1)*conflicts);
};
queens_puzzle.fitness = function(node) {
    return 1*queens_puzzle.evaluate(node);
};
queens_puzzle.halting = function(evaluation) {
    // if we find a solution it's useless to go on in this kind of problem
    return (evaluation == 0);
};
queens_puzzle.cooling = null;

// example options
var queens_options = {
    "infinite_value": 10000,
    "mutation_rate": 0.05,
    "selection_rate": 0.1
};


function mushroom_demo() {
    document.getElementById("status").innerHTML += display_time() + "Calculating simulated annealing...<br />";
    document.getElementById("simulatedannealing").innerHTML = print_queens(simulated_annealing_simple(queens_puzzle, queens_options));
    document.getElementById("status").innerHTML += display_time() + "Done!<br />";

    document.getElementById("status").innerHTML += display_time() + "Calculating genetic algorithm...<br />";
    document.getElementById("geneticalgorithm").innerHTML = print_queens(genetic_algorithm_simple(queens_puzzle, 300, queens_options));
    document.getElementById("status").innerHTML += display_time() + "Done!<br />";

    document.getElementById("status").innerHTML += display_time() + "Loading the mushrooms data set...<br />";
    getJSON("../mushrooms/", function(err, data) {
        if (err != null)
            document.getElementById("status").innerHTML += display_time() + "Something went wrong with the DB: " + err + "<br />";
        else {
            document.getElementById("status").innerHTML += display_time() + "Database loaded!<br />";
            var mushroom_examples = data;

            document.getElementById("status").innerHTML += display_time() + "Learning...<br />";
            var mushroom_attributes = remove_attribute(remove_attribute(Object.keys(mushroom_examples[0]), "classification"), "_id");
            var mushroom_tree_c4_5 = c4_5_simple(mushroom_examples, mushroom_attributes, '?');
            document.getElementById("c4_5tree").innerHTML = syntaxHighlight(mushroom_tree_c4_5);
            document.getElementById("status").innerHTML += display_time() + "Done!<br />";
            document.getElementById("status").innerHTML += display_time() + "Doing validations...<br />";
            var mushroom_validation_c4_5 = cross_validation(mushroom_examples, 10, c4_5_simple);
            var cross_c4_5 = (mushroom_validation_c4_5[0]*100).toFixed(2) + "%";
            var best_c4_5 = (mushroom_validation_c4_5[1]*100).toFixed(2) + "%";
            document.getElementById("c4_5stats").innerHTML = "... Cross Validation -> (average): " + cross_c4_5 + ", (best): " + best_c4_5;
            document.getElementById("status").innerHTML += display_time() + "Done!<br />";
        }
    });
}

mushroom_demo();
