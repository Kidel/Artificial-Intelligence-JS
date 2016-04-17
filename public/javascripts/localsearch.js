// example problem
var queens_puzzle = {
    "name": "queens puzzle",
    "size": 20,
    "get_initial_node": function(){
        var arr = [];
        for(var i = 0; i< this.size; i++){
            arr[i] = 0;
        }
        return arr;
    },
    "create_random_node": function() {
        var arr = [];
        for(var i=0; i<this.get_initial_node().length; i++){
            arr[i] = i;
        }
        //random perturbation
        for(var i=0; i<this.get_initial_node().length; i++){
            this.randomswap(arr);
        }
        return arr;
    },
    "randomswap": function(arr){
        var c1 = Math.floor((Math.random() * (this.size)));
        var c2 = Math.floor((Math.random() * (this.size)));
        var app = arr[c1];
        arr[c1] = arr[c2];
        arr[c2] = app;
        return arr;
    },
    "select_random_successor": function(node) {
        var arr = [];
        for(var i=0; i<node.length; i++){
            arr[i] = node[i];
        }
        // randomly swap 2 columns
        arr = this.randomswap(arr);
        return arr;
    },
    "evaluate": function(node) {
        var conflicts = 0;
        for(var c=0; c<node.length; c++){
            for(var j=0; j<node.length; j++){
                if(c!=j) {
                    //counting queens on the same row
                    if (node[c] == node[c]) conflicts++;
                    //counting queens on the same diagonal
                    if (c+1 < node.length && node[c] == node[c+1]-1) conflicts++;
                    if (c+1 < node.length && node[c] == node[c+1]+1) conflicts++;
                    if (c-1 >= 0 && node[c] == node[c-1]-1) conflicts++;
                    if (c-1 >= 0 && node[c] == node[c-1]+1) conflicts++;
                }
            }
        }
        return ((-1)*conflicts);
    },
    "fitness": function(node) {
        return (this.evaluate(node)+(this.size*(this.size-1)))/(this.size*(this.size-1));
    }
};

// example options
var queens_options = {
    "infinite_value": 10000,
    "cooling": null,
    "halting": function(problem, node) {
        return problem.evaluate(node) == 0; // if we find a solution it's useless to go on
    },
    "mutation_rate": 0.2,
    "selection_rate": 0.05
};


/* Simple Simulated Annealing
 * problem: a problem that has at least a local min/max, with am evaluate, a select_random_successor and a create_random_node function
 * options: json format options to specify a cooling (function), an infinite_value to loop time until that at best, and an halting function based on problem and node
 *
 * returns a local min/max as a node for that problem
 */
var simulated_annealing_simple = function(problem, options){
    var MAX,
        cooling,
        halting;

    var current = problem.create_random_node();

    if(options == null || options.infinite_value == null) MAX = 10000;
    else MAX = options.infinite_value;

    if(options == null || options.cooling == null) {
        cooling = function (t, infinite) {
            return Math.floor(infinite-t);
        };
    }
    else cooling = options.cooling;

    if(options == null || options.halting == null) {
        halting = function(foo, bar) {return false};
    }
    else halting = options.halting;
    // end of setup

    var temp = null;
    for(var time = 1; time < MAX; time++){
        //checking if halting condition is matched
        if(halting(problem, current)) { console.log("annealing halt"); return current;  }

        temp = cooling(time, MAX);
        if(temp == 0) return current;
        var next = problem.select_random_successor(current);
        var d_e = problem.evaluate(next) - problem.evaluate(current);
        if(d_e >= 0) current = next;
        else {
            var prob = Math.pow(Math.E, d_e/temp);
            var rand = Math.random();
            if (rand < prob) current = next;
        }
    }
    return current;
};

/* given 2 nodes (array) and a cut, gives 2 childs with the pieces before and after the cut swapped
 */
var reproduction = function(node1, node2){
    // for each couple make 2 children with a random cut of the sequence
    var cut = Math.floor(Math.random() * (node1.length)); //rand from 0 to last index
    var app1 = [];
    var app2 = [];
    for(var i=0; i<node1.length; i++) {
        if(i<=cut) {
            app1[i]=node1[i];
            app2[i]=node2[i];
        }
        else {
            app1[i]=node2[i];
            app2[i]=node1[i];
        }
    }
    return [app1, app2];
};


/* given a node generates a random mutation in a random slot
 */
var mutation = function(node) {
    node[Math.floor(Math.random() * (node.length))] = Math.floor(Math.random() * (node.length));
    return node;
};


/* Simple Genetic Algorithm
 * problem: a problem that has at least a local min/max, with am evaluate and a create_random_node function.
 * nodes can only be arrays of numbers for now.
 * k: number of initial nodes
 * options: json format options to specify an infinite_value to loop time until that at best and an
 *          halting function based on problem and node.
 *          Can also include mutation rate (from 0 to 1) and selection rate (from 0 to 1)
 *
 * returns a local min/max as a node for that problem
 */
var genetic_algorithm_simple = function(problem, k, options){
    var nodes = [];
    var selections = [];
    var cut = 1;
    var MAX,
        halting,
        mutation_rate,
        selection_rate;

    for(var i=0; i<k; i++){
        nodes[i] = problem.create_random_node();
    }

    if(options == null || options.infinite_value == null) MAX = 10000;
    else MAX = options.infinite_value;
    if(options == null || options.mutation_rate == null) mutation_rate = 10000;
    else mutation_rate = options.mutation_rate;
    if(options == null || options.selection_rate == null) selection_rate = 10000;
    else selection_rate = options.selection_rate;

    if(options == null || options.halting == null) {
        halting = function(foo, bar) {return false};
    }
    else halting = options.halting;
    // initialization done

    for(var j=0; j<MAX; j++) {
        var exclusions = []; // to avoid that the fittest replaces every weak one
        // natural selection killing 10% of the samples
        for(var y = 0; y < Math.floor(k*selection_rate); y++) {
            for (var i = 0; i < k; i++) {
                selections[i] = problem.fitness(nodes[i]);
            }
            var strongest = get_index_and_max_value(selections, exclusions);
            var weakest = get_index_and_min_value(selections, exclusions);
            // killing the weakest
            nodes[weakest.index] = nodes[strongest.index];
            exclusions.push(strongest.index);
        }
        //checking if halting condition is matched
        if (halting(problem, nodes[strongest.index])) { console.log("genetic halt"); return nodes[strongest.index];  }
        // fixing odd number
        if (!is_even(nodes.length)) nodes[nodes.length] = nodes[strongest.index];
        // reproduction for each node
        for(var i=0; i<nodes.length; i+=2){
            // reproduction
            var childs = reproduction(nodes[i], nodes[i+1]);
            nodes[i] = childs[0];
            nodes[i+1] = childs[1];
            // mutation
            if(Math.random()> 1 - mutation_rate) 
                if(problem.fitness(nodes[i])<0) mutation(nodes[i]);
            if(Math.random()> 1 - mutation_rate)
                if(problem.fitness(nodes[i+1])<0) mutation(nodes[i+1]);
        }
    }
    var best = get_index_and_max_value(selections);
    return nodes[best.index];
};