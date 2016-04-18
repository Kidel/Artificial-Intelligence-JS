/* returns true or false if k-means is done. K-means terminates either
 * because it has run a maximum number of iterations OR the centroids
 * stop changing (with a certain tolerance).
 */
var should_stop = function(old_centroids, centroids, iterations, options) {
    if(options == null || options.max_iterations == null) max_iterations = 10000;
    else max_iterations = options.max_iterations;
    if(options == null || options.tolerance == null) tolerance = 10;
    else tolerance = options.tolerance;

    return (iterations > max_iterations || Math.abs(old_centroids - centroids) < tolerance);
};


/* returns a label for each piece of data in the dataset.
 * for each element in the dataset, chose the closest centroid.
 */
var get_labels = function(dataset, centroids) {
    var labels = [];
    for(var i=0; i<dataset.length; i++){
        var distances = [];
        //calculate distance from each centroid
        for(var j=0; j<centroids.length; j++){
            distances[j] = get_distance(dataset[i], centroids[j]);
        }
        labels[i] = get_index_and_min_value(distances, []).index;
    }
    return labels;
};


/* returns k centroids, each of dimension as the number of fields in the dataset.
 * each centroid is the geometric mean of the points that have that centroid's label
 * dataset[i] is in the centroid with index as the value in labels[i]
 */
var get_centroids = function(dataset, labels, k) {
    var groups = [];
    for(var i=0; i<dataset.length; i++){
        groups[labels[i]] = dataset[i];
    }
    // find the center of mass for each group
    var centroids = [];
    for(var i=0; i<groups.length; i++){
        centroids[i] = calculate_centroid(groups[i]);
    }
    // check if we have at least k centroids
    if(centroids.length<k){
        // add random centroids to fill the gap and concat the 2 arrays
        var gap = get_random_centroids(get_features(dataset), k-centroids.length);
        centroids.concat(gap);
    }
    return centroids;
};

var get_features = function(dataset){
    return remove_attribute(Object.keys(dataset[0]), "classification");
    // there isn't supposed to be a "classification" anyway
};


/* returns k random centroids, each with random value for each feature
 */
var get_random_centroids = function(features, k) {
    var centroids = [];
    for(var i=0; i<k; i++){
        centroids[i] = {};
        for(var j=0; j<features.length; j++){
            centroids[i][features[j]] = Math.random()*100; // value from 0 to 99
        }
    }
    return centroids;
};

/* returns the center of mass of a set of vectors
 */
var calculate_centroid = function(vectors) {
    var centroid = {};
    var features = Object.keys(vectors[0]);
    // aggregate each field value on the centroid
    for(var i=0; i<vectors.length; i++){
        for(var j=0; j<features.length; j++){
            centroid[features[j]] += vectors[i][features[j]];
        }
    }
    // average is sum/number
    for(var j=0; j<features.length; j++){
        centroid[features[j]] = centroid[features[j]]/vectors.length;
    }
    return centroid;
};

/* returns the distance between 2 vectors
 */
var get_distance = function(vectorA, vectorB) {
    var sum = 0;
    for(var i=0; i<vectorA.length; i++){
        sum += Math.pow(vectorA[i]-vectorB[i], 2);
    }
    return Math.sqrt(sum);
};

/* returns the approx distance between 2 vectors, only useful to check if a vector is closest to another
 */
var get_manhattan_distance = function(vectorA, vectorB) {
    var sum = 0;
    for(var i=0; i<vectorA.length; i++){
        sum += Math.abs(vectorA[i]-vectorB[i]);
    }
    return sum;
};


/* Simple K Means
 * takes in a dataset and a constant k
 * options are bassed to the should_stop function, may be null.
 *
 * returns k centroids (which define clusters of data in the dataset which are similar to one another).
 */
var k_means_simple = function(dataset, k, options) {
    // initialize centroids randomly
    var centroids = get_random_centroids(get_features(dataset), k);

    // initialize book keeping vars.
    var iterations = 0;
    var old_centroids = [];

    // run the main k-means algorithm
    while (!should_stop(old_centroids, centroids, iterations, options)) {
        // save old centroids for convergence test. Book keeping.
        old_centroids = centroids;
        iterations++;

        // assign labels to each datapoint based on centroids
        var labels = get_labels(dataset, centroids);

        // assign centroids based on datapoint labels
        centroids = get_centroids(dataset, labels, k);
    }
    return {"centroids": centroids, "labels": get_labels(dataset, centroids)};
};