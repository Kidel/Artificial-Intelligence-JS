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
        var c1 = Math.floor((Math.random() * (this.size-1)));
        var c2 = Math.floor((Math.random() * (this.size-1)));
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
        return ((-1)*conflicts)/5;
    }
};

var example_options = {
    "infinite_value": 100000,
    "cooling": null,
    "halting": function(problem, node) {
        return problem.evaluate(node) == 0; // if we find a solution it's useless to go on
    }
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

    if(options == null || options.infinite_value == null) MAX = 100000;
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
        if(halting(problem, current)) return current;

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


/* TODO genetic algorithm
 * problem: a problem that has at least a local min/max, with am evaluate and a create_random_node function
 * options: json format options to specify an infinite_value to loop time until that at best and an halting function based on problem and node
 *
 * returns a local min/max as a node for that problem
 */
