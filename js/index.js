// main window
"use strict";
// globals: document, window, setInterval, setTimeout, requestAnimationFrame, Image

var SC = window.SC || {};

SC.noun = 'balloon';
SC.nouns = 'balloons';
SC.verb = 'pop';
SC.verbed = 'popped';
SC.drawStrings = true;
SC.frame = 0;
SC.time = 0;
SC.oldTime = 0;
SC.now = Date.now();
SC.pause = true;
SC.music_enabled = SC.storage.readBoolean('SC.music_enabled', false);

function purge() {
    SC.storage.eraseAll();
    if (window.hasOwnProperty('chrome')) {
        SC.console.disable();
    }
    document.location.reload();
}

function perf() {
    return "dt=" + SC.dt + ' fps=' + (SC.frame / SC.time).toFixed(1) + ' jitter=' + SC.jitterness + ' frag=' + SC.fragments + '/' + SC.fragmentFrames;
}

SC.onPause = function () {
    // Pause/unpause game
    SC.pause = !SC.pause;
    var buttons = ['Resume', 'Menu'];
    if (SC.pause) {
        SC.popup(
            'Game paused',
            'Take a short break and then come back!',
            'image/player_front_100.png',
            function (aButton) {
                SC.pause = false;
                SC.onMenuReplayNext(aButton || 'Resume');
            },
            buttons,
            false
        );
    }
};

SC.keyboardSpeed = 0.005;

SC.render = function () {
    // Render everything

    // keyboard controls
    if (SC.keyboard.key.a || SC.keyboard.key.ArrowLeft) {
        SC.player.swipe(SC.keyboardSpeed);
    }
    if (SC.keyboard.key.d || SC.keyboard.key.ArrowRight) {
        SC.player.swipe(-SC.keyboardSpeed);
    }

    // measure time
    SC.frame++;
    SC.now = Date.now();
    SC.dt = (SC.now - SC.oldTime) / 1000;
    if (SC.dt < 0) {
        SC.dt = 1 / 60;
    }
    if (SC.dt > 1 / 10) {
        SC.dt = 1 / 10;
    }
    SC.time += SC.dt;
    SC.oldTime = SC.now;

    // buffs
    if (SC.buffs) {
        SC.buffs.update(SC.dt);
    }

    // performance
    if (SC.frame % 60 === 0) {
        // defaults
        SC.perf = 1;
        SC.jitterness = 6;
        SC.fragments = 9;
        SC.fragmentFrames = 200;
        // various speeds
        if (SC.dt > 1 / 50) {
            SC.perf = 2;
            SC.jitterness = 5;
        }
        if (SC.dt > 1 / 40) {
            SC.perf = 3;
            SC.jitterness = 4;
            SC.fragments = 5;
            SC.fragmentFrames = 100;
        }
        if (SC.dt > 1 / 30) {
            SC.perf = 4;
            SC.jitterness = 3;
            SC.fragments = 3;
            SC.fragmentFrames = 50;
        }
        if (SC.dt > 1 / 20) {
            SC.perf = 5;
            SC.jitterness = 2;
            SC.fragments = 3;
            SC.fragmentFrames = 50;
        }
        if (SC.perf > SC.perfMax) {
            SC.perfMax = SC.perf;
        }
    }

    // clear canvas
    SC.context.clearRect(0, 0, SC.w, SC.h);

    var i, sort = false;
    for (i = 0; i < SC.ridges.length; i++) {

        SC.ridges[i].d -= SC.player.speed * (SC.dt / 0.01666);

        if (SC.ridges[i].d > -0.3) {
            // ridge, balloons, hits, explosions
            if (SC.ridges[i].d > 0) {
                SC.ridges[i].render(SC.x);
            }
            SC.balloonsRender(SC.ridges[i].balloons, SC.ridges[i].d, SC.ridges[i].line);
            SC.balloonsHit(SC.ridges[i].balloons, SC.ridges[i].d);
        } else {
            // cross mountain, add new one
            SC.player.distance++;
            if (SC.level.hasOwnProperty('mountain')) {
                if (SC.level.mountain(SC.player.distance)) {
                    SC.onWin();
                }
            }

            // level event when ridge is discarded can check for unpopped balloons
            if (SC.level.discard) {
                SC.level.discard(SC.ridges[i]);
            }

            if (SC.level.balloons) {
                SC.ridges[i] = new SC.ridge(1, false);
                SC.ridges[i].balloons = SC.level.balloons(SC.ridges[i].line);
            } else {
                SC.ridges[i] = new SC.ridge(1, true);
            }
            SC.ridgesCreated++;
            sort = true;
        }
    }
    if (sort) {
        SC.ridges.sort(function (a, b) {
            return b.d - a.d;
        });
    }

    // render player
    SC.player.inertia();
    SC.explosions.render();
    SC.player.render();
};

SC.resize = function () {
    // Resize canvas
    SC.w = SC.canvas.clientWidth;
    SC.h = SC.canvas.clientHeight;
    SC.canvas.width = SC.w;
    SC.canvas.height = SC.h;
    if (!SC.pause) {
        SC.render();
    }
};

SC.loop = function () {
    // Main rendering loop
    if (!SC.pause) {
        SC.render();
    }
    requestAnimationFrame(SC.loop);
};

SC.onTouchStart = function (event) {
    // Move player by swiping
    SC.touchX = event.targetTouches[0].clientX;
    //console.log('SC.onTouchStart', event.targetTouches[0].clientX);
};
SC.onTouchMove = function (event) {
    // Move player by swiping
    var dx = -(event.targetTouches[0].clientX - SC.touchX);
    SC.touchX = event.targetTouches[0].clientX;
    //console.log('SC.onTouchMove', event.targetTouches[0].clientX, dx);
    SC.player.swipe(dx / SC.w);
    if (event.target === SC.canvas) {
        event.preventDefault();
    }
};

SC.onMouseDown = function (event) {
    // Move player by mouse
    if (event.which === 1) {
        SC.mouseLeft = true;
        SC.touchX = event.clientX;
    }
};
SC.onMouseMove = function (event) {
    // Move player by swiping
    if (SC.mouseLeft) {
        var dx = -(event.clientX - SC.touchX);
        SC.touchX = event.clientX;
        SC.player.swipe(dx / SC.w);
    }
};
SC.onMouseUp = function (event) {
    // Move player by mouse
    if (event.which === 1) {
        SC.mouseLeft = false;
    }
};

SC.onStart = function (aLevelKey) {
    // Start given level
    console.log('onStart', aLevelKey);
    var old = SC.levelKey, obj;
    SC.levelKey = aLevelKey;

    // reset variables
    SC.onFailCalled = false;
    SC.onWinCalled = false;
    SC.frame = 0;
    SC.time = 0;
    SC.oldTime = SC.now;
    SC.monochrome = false;
    SC.monochromeCount = 0;
    document.body.style.backgroundColor = '#bceabc';
    SC.explosions.reset();
    SC.player.reset();
    SC.buffs.reset();
    SC.ridgesCreated = 0;
    SC.perfMax = 0;

    // load level
    SC.level = SC.levels[aLevelKey];
    SC.level.init();

    // first few ridges
    SC.ridges = [
        new SC.ridge(1, true),
        new SC.ridge(0.8, true),
        new SC.ridge(0.6),
        new SC.ridge(0.4),
        new SC.ridge(0.2)
    ];
    SC.ridgeFade = new SC.ridge(0);
    SC.ridgeY = 0;

    SC.render();
    obj = SC.level.objective.slice();
    SC.popup('Level ' + (Object.keys(SC.levels).indexOf(aLevelKey) + 1), obj, 'image/balloons.png', function () {
        SC.pause = false;
    }, undefined);

    if (SC.music_enabled && (old !== SC.levelKey)) {
        SC.music.next();
    }

};

SC.onMenuReplayNext = function (aButton) {
    // Common popup callback
    console.log('button', aButton);
    // Resume game
    if (aButton === 'Resume') {
        SC.pause = false;
        return;
    }
    // Show main menu
    if (aButton === 'Menu') {
        SC.menu();
        return;
    }
    // Next level (if possible)
    if (aButton === 'Next') {
        var k = Object.keys(SC.levels),
            i = k.indexOf(SC.levelKey),
            ts;
        if (k[i + 1]) {
            // enough stars?
            ts = SC.stars.sum() + SC.achievements.stars();
            if (ts >= SC.levels[k[i + 1]].requires) {
                SC.onStart(k[i + 1]);
            } else {
                SC.popup('Not enough stars!', 'You need ' + SC.levels[k[i + 1]].requires + ' stars for next level but you only have ' + ts + '. Improve previous levels or complete achievements to get more stars.', '⭐', SC.onMenuReplayNext, ['Menu', 'Replay'], false, 0, null);
            }
            return;
        }
        // last level
        SC.popup('Congratulation', 'All levels completed!', 'image/achievement/achievement3.png', SC.onMenuReplayNext, ['Menu', 'Replay'], true, 0, {});
        return;
    }
    // replay
    SC.onStart(SC.levelKey);
};

SC.onWin = function () {
    // Player win
    if (SC.onWinCalled) {
        return;
    }
    SC.onWinCalled = true;
    SC.pause = true;
    var stars = SC.levels[SC.levelKey].stars(),
        bas = SC.player.balloonsAndStats(),
        buttons = ['Next', 'Replay', 'Menu'];
    SC.achievements.add('mountains', SC.player.distance);
    SC.achievements.add('time', SC.time);
    SC.achievements.add('win', 1);
    SC.showAllAchievements(function () {
        SC.stars.add(SC.levelKey, stars);
        SC.sound.play('win');
        SC.popup('Level complete!', null, '', function (aButton) {
            SC.onMenuReplayNext(aButton || 'Next');
        }, buttons, false, stars, bas);
    });
};

SC.onFail = function () {
    // Player failed
    if (SC.onFailCalled) {
        return;
    }
    SC.onFailCalled = true;
    var bas = SC.player.balloonsAndStats(),
        buttons = ['Replay', 'Menu'];
    SC.pause = true;
    SC.achievements.add('mountains', SC.player.distance);
    SC.achievements.add('time', SC.time);
    SC.achievements.add('fail', 1);
    SC.showAllAchievements(function () {
        SC.sound.play('gameover');
        SC.popup('Game over!', '', '', SC.onMenuReplayNext, buttons, false, 0, bas);
    });
};

SC.onMusic = function () {
    // Play/pause music
    SC.music_enabled = !SC.music_enabled;
    SC.storage.writeBoolean('SC.music_enabled', SC.music_enabled);
    if (SC.music) {
        if (SC.music_enabled) {
            SC.music.next();
        } else {
            SC.music.stop();
        }
    }
};

SC.onLocked = function (aMessage) {
    // Show message when level is locked
    SC.splash('Locked!', [], 'pink', function (aContent) {
        aContent.innerText = aMessage;
    }, null, '50vw', 'auto');
};

SC.menu = function () {
    // Show main menu
    var a, ac, div, stars_and_achievements = JSON.parse(JSON.stringify(SC.stars.stars));
    stars_and_achievements.achievements = SC.achievements.stars();

    SC.pause = true;
    div = SC.levelsScreen(
        'Balloon Mountains',
        'image/player_front_100.png',
        'image/balloons.png',
        'image/krivan.jpg',
        SC.levels,
        stars_and_achievements,
        SC.onStart,
        SC.achievements.show,
        SC.onLocked
    );

    a = div.getElementsByClassName('levels_extra')[0];
    ac = document.createElement('button');
    ac.textContent = '?';
    ac.onclick = SC.buffs.help;
    a.appendChild(ac);

    if (SC.music) {
        a = div.getElementsByClassName('levels_extra')[0];
        ac = document.createElement('button');
        ac.textContent = '🎵';
        ac.onclick = SC.onMusic;
        a.appendChild(ac);
    }
};

SC.levelAchievements = [];

SC.onAchievement = function (aKey, aLimit, aValue, aLevel) {
    // Track achievements for current level
    console.log('SC.onAchievement', aKey, aLimit, aValue);
    SC.levelAchievements.push({key: aKey, limit: aLimit, value: aValue, level: aLevel});
};

SC.showAllAchievements = function (aCallback) {
    // Show achievements all at once at the end of the level
    if (SC.levelAchievements.length <= 0) {
        aCallback();
        return;
    }
    var o = SC.pause, cur = SC.levelAchievements.shift(), suffix;
    SC.pause = true;
    SC.sound.play('achievement');

    suffix = cur.key + ' ' + SC.nouns + ' ' + SC.verbed;
    if (cur.key === 'balloons') {
        suffix = SC.nouns + ' ' + SC.verbed;
    }
    if (cur.key === 'mountains') {
        suffix = 'mountains crossed';
    }
    if (cur.key === 'time') {
        suffix = 'seconds flying';
    }

    SC.popup('New achievement!', cur.limit + ' ' + suffix, 'image/achievement/' + cur.key + '_' + cur.level + '.png', function () {
        SC.pause = o;
        if (SC.levelAchievements.length > 0) {
            SC.showAllAchievements(aCallback);
        } else {
            SC.achievements.save();
            aCallback();
        }
    }, [], true, cur.level);
};

window.addEventListener('DOMContentLoaded', function () {
    // initialize window
    try {
        SC.canvas = document.getElementById('canvas');
        SC.context = SC.canvas.getContext('2d');
        window.addEventListener('resize', SC.resize);
        SC.resize();
        SC.loop();

        SC.sound.add('pop', 5);
        SC.sound.add('argh', 1);
        SC.sound.add('win', 3);
        SC.sound.add('gameover', 3);
        SC.sound.add('achievement', 3);
        SC.sound.add('count', 8);
        SC.sound.add('beep', 5);
        SC.sound.add('click', 3);
        SC.sound.add('ooh', 2);
        SC.sound.add('star_yes', 3);
        SC.sound.add('star_no', 3);

        if (SC.music) {
            SC.music.add('Gravity Sound - Summers End');
            SC.music.add('Gravity Sound - Afternoon');
            SC.music.add('Gravity Sound - Chill Instrumental');
            SC.music.add('Gravity Sound - Soundscape');
            SC.music.add('Gravity Sound - Trail');
        }

        /*
        SC.sound.play = function () { window.i = 0; };
        SC.music.play = function () { window.i = 0; };
        */

        window.addEventListener('touchstart', SC.onTouchStart);
        window.addEventListener('touchmove', SC.onTouchMove, {passive: false});
        window.addEventListener('mousedown', SC.onMouseDown);
        window.addEventListener('mousemove', SC.onMouseMove);
        window.addEventListener('mouseup', SC.onMouseUp);
        document.getElementById('pause').addEventListener('click', SC.onPause);

        // different levels for different achievements
        SC.achievements.levels = [100, 500, 1000];
        SC.achievements.keyLevels.mountains = [1000, 2000, 3000];
        SC.achievements.keyLevels.black = [10, 50, 100];
        SC.achievements.callback = SC.onAchievement;
        SC.achievements.visible = {
            'mountains': 'Mountains crossed',
            'time': 'Fly time',
            'balloons': 'Total balloons popped',
            'black': 'Black balloons popped',
            'blue': 'Blue balloons popped',
            'brown': 'Brown balloons popped',
            'cyan': 'Cyan balloons popped',
            'gray': 'Gray balloons popped',
            'green': 'Green balloons popped',
            'lime': 'Lime balloons popped',
            'orange': 'Orange balloons popped',
            'pink': 'Pink balloons popped',
            'purple': 'Purple balloons popped',
            'red': 'Red balloons popped',
            'white': 'White balloons popped',
            'yellow': 'Yellow balloons popped'
        };

        // show menu
        SC.menu();
    } catch (e) {
        alert(e);
    }
});

