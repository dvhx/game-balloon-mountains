// Player
"use strict";
// globals: Image, document

var SC = window.SC || {};

SC.airport = document.location.search.match('mode=airport') ? true : false;

SC.player = (function () {
    // Player
    var self = {};
    self.image = new Image();
    self.image.src = SC.airport ? 'image/airport/fly256.png' : 'image/fly256.png';

    self.reset = function () {
        // Reset player values
        self.x = 0.5;
        self.dir = 0;
        self.angle = 0;
        self.spiral = 0;
        self.score = 0;
        self.speed = 0.005;
        self.life = 100;
        self.balloons = {};
        self.total = 0;
        self.distance = 0;
    };
    self.reset();

    self.speedLimit = function () {
        // Limit speed
        if (self.speed < 0.001) {
            self.speed = 0.001;
        }
        if (self.speed > 0.1) {
            self.speed = 0.1;
        }
    };

    self.swipe = function (aDx) {
        // Move player after swiping
        if (self.life <= 0) {
            return;
        }
        self.dir = aDx;
        self.x -= 0.2 * aDx;
        if (self.x <= 0.1) {
            self.x = 0.1;
        }
        if (self.x > 1 - 0.1) {
            self.x = 1 - 0.1;
        }
    };

    self.inertia = function () {
        // Continue moving in given direction
        self.dir *= 0.95;
        if (Math.abs(self.dir) > 0.001) {
            self.swipe(self.dir);
        }
        self.angle -= 10 * self.dir;
        self.angle *= 0.95;
        if (self.angle > 2) {
            self.angle = 2;
        }
        if (self.angle < -2) {
            self.angle = -2;
        }
    };

    self.render = function () {
        // Render player
        var size = 100;
        SC.context.save();
        SC.context.translate(SC.w / 2 - 50, SC.h - 100);
        SC.context.save();
        //SC.context.scale(size / 256, size / 256);
        SC.context.translate(size / 2, size / 2);
        SC.context.rotate(self.angle + self.spiral / Math.PI);
        SC.context.translate(-size / 2, -size / 2);
        //SC.context.translate(SC.w / 2 - 50, SC.h - 100);
        SC.context.drawImage(SC.player.image, 0, -8 - Math.sin(SC.frame / 20) * 8, size, size);
        SC.context.restore();
        SC.context.restore();
    };

    self.pop = function (aType) {
        // Register popped balloon
        self.balloons[aType] = self.balloons[aType] || 0;
        self.balloons[aType]++;
        self.total++;
    };

    self.balloonsAndStats = function () {
        // Balloons, total, time, mountains
        var o = JSON.parse(JSON.stringify(self.balloons));
        o.EOL = 1;
        o.balloons = self.total;
        o.mountains = self.distance;
        o.time = SC.time.toFixed(1);
        return o;
    };

    return self;
}());


