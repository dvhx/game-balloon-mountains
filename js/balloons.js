// Ballons rendering and functions
"use strict";
// globals: Image, document, setTimeout

var SC = window.SC || {};

SC.balloonImages = {};

SC.balloon = function (aX, aType) {
    // Create one balloon
    this.x = aX;
    this.type = aType || 'pink';
    this.visible = true;
};

SC.balloonsRandom = function (aLine) {
    // Generate random balloons (prefer peaks of given line) using level-defined random function
    var block = Math.floor(aLine.length / 16), i = block, maxx = 0, maxy = 0, maxi = 0, bal = [], x, y;
    while (i < aLine.length) {
        x = aLine[i][0];
        y = aLine[i][1];
        if (y > maxy && x > 0.1 && x < 0.9) {
            maxx = x;
            maxy = y;
            maxi = i;
        }
        if ((maxi > 0) && (i - maxi >= block)) { //  /*&& (maxy > 0.2)*/
            bal.push(new SC.balloon(maxx, SC.level.random()));
            maxx = 0;
            maxy = 0;
            maxi = 0;
        }
        i++;
    }
    return bal;
};

SC.balloonsRender = function (aBalloons, aDistance, aLine) {
    // Render balloons
    var size, bi, a, b, i, bx, by, by2, d;
    if (SC.monochrome) {
        SC.context.strokeStyle = 'rgba(170,170,170,' + (1 - aDistance) + ')';
    } else {
        SC.context.strokeStyle = 'rgba(255,128,128,' + (1 - aDistance) + ')';
    }
    size = (1 - aDistance) * 50;
    size = 5 + 35 * (1 - Math.sin(aDistance * Math.PI / 2));
    if (size > 40) {
        size = 40;
    }
    d = SC.h - Math.sin(aDistance * Math.PI / 2) * SC.h * 0.5;
    //console.log('size', size);
    SC.context.globalAlpha = 1 - aDistance * aDistance;
    for (bi = 0; bi < aBalloons.length; bi++) {
        if (!aBalloons[bi].visible) {
            continue;
        }
        a = SC.player.x - 0.1;
        b = SC.player.x + 0.1;
        i = Math.round(aBalloons[bi].x * aLine.length);
        bx = (aBalloons[bi].x - a) * SC.w / (b - a);
        by = d + 50 - 0.5 * 150;
        //console.log('ll', aLine.length, 'i', i)
        by2 = d + 50 - aLine[i][1] * 150;
        //console.log('a', a, 'b', b, 'i', i, 'bx', bx, 'by', by);
        SC.context.drawImage(SC.sprites.sprites[SC.monochrome ? 'gray' : aBalloons[bi].type], bx - size / 2, by - 2 * size + SC.ridgeY, size, size);
        // string
        if (SC.drawStrings) {
            SC.context.beginPath();
            SC.context.moveTo(bx, by - size + SC.ridgeY);
            SC.context.lineTo(bx, by2 + SC.ridgeY);
            SC.context.closePath();
            SC.context.stroke();
        }
    }
    SC.context.globalAlpha = 1;
};

SC.balloonsHit = function (aBalloons, aDistance) {
    // Test if player hit balloons
    var i, px = SC.player.x, s = SC.player.score, sizeD = SC.level.hitboxSizeY || 0.05, sizeX = SC.level.hitboxSizeX || 0.02;
    if (SC.player.life <= 0) {
        return;
    }
    if (Math.abs(aDistance) < sizeD) {
        for (i = 0; i < aBalloons.length; i++) {
            if (aBalloons[i].visible && (Math.abs(px - aBalloons[i].x) < sizeX)) {
                aBalloons[i].visible = false;
                SC.player.score++;
                SC.player.pop(aBalloons[i].type);
                SC.sound.play('pop');
                SC.explosions.add(SC.monochrome ? 'gray' : aBalloons[i].type, SC.w / 2 - 15, SC.h - 50 - 15);

                if (SC.buffs[aBalloons[i].type]) {
                    SC.buffs[aBalloons[i].type]();
                }

                if (SC.level.hit(aBalloons[i].type, aBalloons[i])) {
                    SC.onWin();
                }

                SC.achievements.add('balloons', 1);
                SC.achievements.add(aBalloons[i].type, 1);
            }
        }
    }
    if (s !== SC.player.score) {
        SC.player.speed *= 1.02;
        SC.player.speedLimit();
    }
};

SC.balloonsStats = function (aKeyValue) {
    // Show animated balloon statistics at the end of the level
    var div, figure, img, figcaption, k, a = [], speed = 0, eol = false;
    div = document.createElement('div');
    div.className = 'stats';
    for (k in aKeyValue) {
        if (aKeyValue.hasOwnProperty(k)) {
            figure = document.createElement('div');
            if (k === 'EOL') {
                figure.style.flexBasis = '100%';
                div.appendChild(figure);
                eol = true;
                continue;
            }
            img = document.createElement('img');
            img.src = 'image/' + k + '.png';
            img.style.width = eol ? '2em' : '1em';
            img.style.height = eol ? '2em' : '1em';
            figcaption = document.createElement('div');
            figcaption.innerHTML = '&nbsp;'; //textContent = ''; //aKeyValue[k];
            figcaption.style.fontSize = 'x-small';
            figcaption.style.color = k;
            figcaption.style.textShadow = '1px 1px 0px rgba(0,0,0,0.5)';
            figure.appendChild(img);
            figure.appendChild(figcaption);
            div.appendChild(figure);
            a.push({element: figcaption, current: 0, max: aKeyValue[k]});
            div.appendChild(figure);
            //speed += aKeyValue[k];
            if (aKeyValue[k] > speed) {
                speed = aKeyValue[k];
            }
        }
    }
    speed = 2000 / speed;
    function animate() {
        var i, again = false;
        for (i = 0; i < a.length; i++) {
            if (a[i].current < a[i].max) {
                a[i].current++;
                a[i].element.textContent = a[i].current;
                if (a[i].current > a[i].max) {
                    a[i].element.textContent = a[i].max;
                }
                if (!again) {
                    SC.sound.play('count');
                }
                again = true;
                //break;
            }
        }
        if (again) {
            setTimeout(animate, speed);
        }
    }
    setTimeout(animate, 500);
    return div;
};

