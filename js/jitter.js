// Jittery line between 2 points
"use strict";
// globals:

var SC = window.SC || {};

SC.jitterness = 6;

SC.midpoint = function (x1, y1, x2, y2, h, d) {
    // Return random midpoint
    var cx = (x1 + x2) / 2,
        cy = (y1 + y2) / 2 + h * (Math.random() - Math.random()) / d;
    return [cx, cy];
};

SC.randomLine = function (aVertex1, aVertex2, aDepth) {
    // Create random line between 2 vertices
    if (!aVertex1) {
        aVertex1 = [0, 0];
        aVertex2 = [1, 0];
        aDepth = SC.jitterness;
    }
    var i, orig = [aVertex1, aVertex2], n, a, b, v, mp;

    // this is to prevent pure midpoint algo doing only piramids/valleys
    orig = [
        aVertex1,
        [0.2, 0.5 * (Math.random() - Math.random())],
        [0.4, 0.5 * (Math.random() - Math.random())],
        [0.6, 0.5 * (Math.random() - Math.random())],
        [0.8, 0.5 * (Math.random() - Math.random())],
        aVertex2];

    for (i = 0; i < aDepth; i++) {
        n = [];
        for (v = 0; v < orig.length - 1; v++) {
            a = v;
            b = v + 1;
            mp = SC.midpoint(orig[a][0], orig[a][1], orig[b][0], orig[b][1], 0.5, (1 + i) * (1 + i));
            if (v === 0) {
                n.push(orig[a]);
            }
            n.push(mp);
            n.push(orig[b]);
        }
        orig = n;
    }
    return n;
};

