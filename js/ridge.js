// Mountain ridge generator and rendering
"use strict";
// globals:

var SC = window.SC || {};

SC.ridgeY = 0;

SC.ridge = function (aDistance, aWithBalloons) {
    // Jittery mountain ridge
    this.d = aDistance;
    this.line = SC.randomLine();
    if (aWithBalloons) {
        this.balloons = SC.balloonsRandom(this.line, (SC.level && SC.level.types) || SC.sprites.balloons);
    } else {
        this.balloons = [];
    }
};

SC.ridge.prototype.color = function (aDistance) {
    // Linearly interpolated ridge color (distant ridges are more hazy)
    if (aDistance < 0) {
        aDistance = 0;
    }
    if (aDistance > 1) {
        aDistance = 1;
    }
    var r = Math.round(5 + aDistance * (123 - 5)),
        g = Math.round(77 + aDistance * (195 - 77)),
        b = Math.round(63 + aDistance * (181 - 63)),
        a = aDistance < 0.8 ? 1 : 1 - (aDistance - 0.8) / 0.2;
    if (SC.monochrome) {
        r = Math.round((r + g + b) / 3);
        g = r;
        b = r;
    }
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};

SC.ridge.prototype.render = function () {
    // Render jittery line of mountain ridge
    SC.context.fillStyle = this.color(this.d);
    SC.context.beginPath();
    var i,
        a,
        b,
        ia,
        ib,
        x,
        y,
        sx,
        sy,
        d = SC.h - Math.sin(this.d * Math.PI / 2) * SC.h * 0.5;

    a = SC.player.x - 0.1;
    b = SC.player.x + 0.1;
    ia = Math.floor(a * this.line.length) - 1;
    if (ia < 0) {
        ia = 0;
    }
    ib = Math.ceil(b * this.line.length) + 1;
    if (ib > this.line.length - 1) {
        ib = this.line.length - 1;
    }

    //console.log('a', a, 'b', b, 'ia', ia, 'ib', ib, 't.d', this.d);
    SC.context.moveTo(0, d);
    for (i = ia; i < ib; i++) {
        // line coords
        x = this.line[i][0];
        y = this.line[i][1];
        // screen coords
        sx = (x - a) * SC.w / (b - a);
        sy = d + 50 - y * 150 + SC.ridgeY;
        SC.context.lineTo(sx, sy);
        //console.log('x', x, 'y', y, 'sx', sx, 'sy', sy);
    }

    SC.context.lineTo(SC.w, sy);
    SC.context.lineTo(SC.w, SC.h);
    SC.context.lineTo(0, SC.h);
    SC.context.closePath();
    SC.context.fill();
};



