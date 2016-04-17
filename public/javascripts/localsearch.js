/* Simple Simulated Annealing
 * problem: a problem that has at least a local min/max, with am evaluate, a select_random_successor and a create_random_node function
 *          Can also include a halting function.
 * options: json format options to specify  an infinite_value to loop time until that at best.
 *
 * returns a local min/max as a node for that problem
 */
var simulated_annealing_simple = function(problem, options){
    var infinite_value,
        cooling,
        halting;

    var current = problem.create_random_node();
    console.log(current);

    if(options == null || options.infinite_value == null) infinite_value = 100000;
    else infinite_value = options.infinite_value;

    if(problem.cooling == null) {
        cooling = function (t, infinite) {
            return Math.floor(((infinite-t)/infinite)*50)+1;
        };
    }
    else cooling = problem.cooling;

    if(problem.halting == null) {
        halting = function(foo) {return false};
    }
    else halting = problem.halting;
    // end of setup
    var loops = 0;
    var temp = null;
    for(var time = 1; time < infinite_value; time++){
        //checking if halting condition is matched
        var evaluation = problem.evaluate(current);
        if(halting(evaluation)) { console.log("annealing halt"); return current;  }

        temp = cooling(time, infinite_value);
        if(temp == 0) return current;
        var next = problem.select_random_successor(current);
        var d_e = problem.evaluate(next) - evaluation;
        if(d_e >= 0) current = next;
        else {
            var prob = Math.pow(Math.E, d_e/temp)/2;
            var rand = Math.random();
            if (rand < prob) current = next;
            //console.log("temp ", temp, " prob ", prob, " rand ", rand, " evaluation ", evaluation, " d_e ", d_e);
        }
        loops++;
    }
    return current;
};

/* given 2 nodes (array) and a cut, gives 2 childs with the pieces before and after the cut swapped
 */
var reproduction = function(node1, node2){
    // for each couple make 2 children with a random cut of the sequence
    do {
        var cut = Math.floor(Math.random() * (node1.length-1)); //rand from 0 to (last_index-1)
    } while(node1[cut] == node2[cut+1]); // avoid copying some duplicates
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
var mutation = function(node, rate) {
    if(Math.random() >= rate) return node;
    node[Math.floor(Math.random() * (node.length))] = Math.floor(Math.random() * (node.length));
    return node;
};


/* Simple Genetic Algorithm
 * problem: a problem that has at least a local min/max, with am evaluate and a create_random_node function.
 * nodes can only be arrays of numbers for now. Can also include a halting function.
 * k: number of initial nodes
 * options: json format options to specify an infinite_value to loop time until that at best.
 *          Can also include mutation rate (from 0 to 1, 0.1 meaning 10% mutation rate) and
 *          a selection rate (from 0 to 0.5, 0.2 meaning that 20% will die every generation)
 *
 * returns a local min/max as a node for that problem
 */
var genetic_algorithm_simple = function(problem, population_size, options) {
    var catastrophe_free_generations = 0.10 * max_generations;
    var current_generation; // counter
    var max_generations;
    var individuals = [];
    var selection_rate;
    var mutation_rate;
    if (options == null || options.infinite_value == null) max_generations = 10000;
    else max_generations = options.infinite_value;
    if (options == null || options.mutation_rate == null) mutation_rate = 0.05;
    else mutation_rate = options.mutation_rate;
    if (options == null || options.selection_rate == null) selection_rate = 0.1;
    else selection_rate = options.selection_rate;

    function compare_fitness(a,b) {
        if (a.fitness > b.fitness)
            return -1;
        else if (a.fitness < b.fitness)
            return 1;
        else
            return 0;
    }

    function create_individuals() {
        for (var i = 0; i < population_size; i++) {
            individuals[i] = {};
            individuals[i].node = problem.create_random_node();
            individuals[i].fitness = problem.fitness(individuals[i].node);
        }
        // select best, ordering by fitness
        individuals.sort(compare_fitness);
    }
    create_individuals();
    if (problem.halting(individuals[0].node)) { console.log("genetic halt"); return individuals[0].node; }
    //setup done

    for (current_generation = 0; current_generation <= max_generations; current_generation++) {
        // catastrophe.
        if ((current_generation > catastrophe_free_generations) && (Math.random() > 0.05)) {
            catastrophe_free_generations += current_generation + catastrophe_free_generations;
            create_individuals();
        }

        // create next generation with the fittest
        var new_individuals = [];
        for(var i=0; i<individuals.length; i+=2){
            var index;
            // excluding the weakest
            if(i<Math.floor(individuals.length*(1-selection_rate)))
                index = i;
            else
                index = i - Math.floor(individuals.length*(1-selection_rate));

            var app = reproduction(individuals[index].node, individuals[index+1].node);
            var brothers = [{}, {}];
            for(var b in brothers){
                // random mutation
                brothers[b].node = mutation(app[0], mutation_rate);
                brothers[b].fitness = problem.fitness(brothers[b].node);
                new_individuals.push(brothers[b]);
            }
        }
        new_individuals.sort(compare_fitness);
        individuals = new_individuals;
        if (problem.halting(individuals[0].node)) { console.log("genetic halt"); return individuals[0].node; }
    }
    console.log(individuals[0]);
    return individuals[0].node;
};
