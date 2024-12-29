// Animate exploding sprites
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.fragments = 9;
SC.fragmentFrames = 50;

SC.chunk = function (aImg, aX, aY, aSrcX, aSrcY, aSrcW, aSrcH, aDstX, aDstY, aDstW, aDstH) {
    // Create single chunk of image
    this.img = aImg;
    this.x = aX;
    this.y = aY;
    this.sx = aSrcX;
    this.sy = aSrcY;
    this.sw = aSrcW;
    this.sh = aSrcH;
    this.dx = aDstX - aDstW / 2;
    this.dy = aDstY - aDstH / 2;
    this.dw = aDstW;
    this.dh = aDstH;
    var ax = aSrcX + aSrcW / 2,
        ay = aSrcY + aSrcH / 2,
        bx = 256 / 2,
        by = 256 / 2;
    this.vx = (ax - bx) / 40 + 0.5 * (Math.random() - Math.random());
    this.vy = (ay - by) / 40 + 0.5 * (Math.random() - Math.random());
};

SC.chunk.prototype.update = function () {
    // Update position of flying chunk
    SC.context.drawImage(this.img, this.sx, this.sy, this.sw, this.sh, this.dx, this.dy, this.dw, this.dh);
    var dt = 1;
    this.vy += 0.2 * dt;
    this.dx += this.vx;
    this.dy += this.vy;
};

SC.explosions = (function () {
    // Explosions manager
    var self = {};
    self.explosions = [];

    self.reset = function () {
        // Clear explosions
        self.explosions = [];
    };

    self.add = function (aType, aX, aY) {
        // Create balloon chunks
        var e = {}, s = 50, t = s / 3;
        e.img = SC.sprites.sprites[aType];
        e.c7 = new SC.chunk(e.img, aX, aY, 0, 0, 85, 85, aX, aY, t, t);
        e.c8 = new SC.chunk(e.img, aX, aY, 86, 0, 85, 85, aX + t, aY, t, t);
        e.c9 = new SC.chunk(e.img, aX, aY, 171, 0, 85, 85, aX + 2 * t, aY, t, t);
        e.c4 = new SC.chunk(e.img, aX, aY, 0, 86, 85, 85, aX, aY + t, t, t);
        e.c5 = new SC.chunk(e.img, aX, aY, 86, 86, 85, 85, aX + t, aY + t, t, t);
        e.c6 = new SC.chunk(e.img, aX, aY, 171, 86, 85, 85, aX + 2 * t, aY + t, t, t);
        e.c1 = new SC.chunk(e.img, aX, aY, 0, 171, 85, 85, aX, aY + 2 * t, t, t);
        e.c2 = new SC.chunk(e.img, aX, aY, 86, 171, 85, 85, aX + t, aY + 2 * t, t, t);
        e.c3 = new SC.chunk(e.img, aX, aY, 171, 171, 85, 85, aX + 2 * t, aY + 2 * t, t, t);
        e.frame = 0;
        self.explosions.push(e);
    };

    self.render = function () {
        // Render all chunks
        var i, e;
        for (i = self.explosions.length - 1; i >= 0; i--) {
            e = self.explosions[i];
            if (e.frame <= SC.fragmentFrames) {
                e.frame++;
                e.c7.update();
                e.c8.update();
                e.c9.update();
                if (SC.fragments > 3) {
                    e.c4.update();
                    e.c5.update();
                    e.c6.update();
                    if (SC.fragments > 6) {
                        e.c1.update();
                        e.c2.update();
                        e.c3.update();
                    }
                }
            } else {
                self.explosions.splice(i, 1);
            }
        }
    };

    return self;
}());

