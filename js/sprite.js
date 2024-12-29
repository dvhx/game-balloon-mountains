// Image sprites
"use strict";
// globals: document, window, Image

var SC = window.SC || {};

SC.sprites = (function () {
    // Image sprites
    var self = {};
    self.sprites = {};

    self.add = function (aName) {
        self.sprites[aName] = new Image();
        self.sprites[aName].src = 'image/' + aName + '.png';
    };

    self.add('black');
    self.add('blue');
    self.add('cyan');
    self.add('gray');
    self.add('green');
    self.add('lime');
    self.add('orange');
    self.add('pink');
    self.add('purple');
    self.add('red');
    self.add('white');
    self.add('yellow');
    self.add('brown');

    self.balloons = Object.keys(self.sprites);

    return self;
}());

