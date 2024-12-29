// Random balloon generator
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.random = function (aTypesAndFrequencies) {
    // Random balloon generator
    var keys = [],
        frequencies = [],
        sum = 0,
        j;

    // Split {red:5, pink:10} to [red,pink] [5,10] for faster RNG
    keys = Object.keys(aTypesAndFrequencies);
    for (j = 0; j < keys.length; j++) {
        sum += aTypesAndFrequencies[keys[j]];
        frequencies.push(sum);
    }

    return function () {
        var i, r = Math.random() * sum, len = keys.length;
        for (i = 0; i < len; i++) {
            if (r < frequencies[i]) {
                return keys[i];
            }
        }
    };
};

