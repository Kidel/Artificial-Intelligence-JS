/* base 2 logarithm
 */
var base2_log = function(x) {
    return Math.log(x)/Math.log(2);
};

/* recursively clones an object
 */
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

/* returns a copy of the array with the element removed once
 */
var remove_element = function(elements, to_remove) {
    var array = elements.slice(0);
    for (var i=array.length-1; i>=0; i--) {
        if (array[i] === to_remove) {
            array.splice(i, 1);
        }
    }
    return array;
};