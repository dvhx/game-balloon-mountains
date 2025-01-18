// Levels
"use strict";
// linter: ngspicejs-lint
// global: document, window, setTimeout

var SC = window.SC || {};

SC.standardDistribution = {
    black: 1,
    brown: 2,
    red: 2,
    gray: 2,
    yellow: 2,
    blue: 3,
    cyan: 4,
    orange: 5,
    white: 5,
    green: 6,
    purple: 7,
    lime: 10,
    pink: 10
};

SC.unused = function () {
    return false;
};

SC.levels = {};

/*
Variable            Description

SC.time             Elapsed time in seconds (e.g. 15.6)
SC.player.total     Total amount of popped balloons (e.g. 4)
SC.player.balloons  Colors and counts of popped balloons (e.g. {pink: 3, cyan: 1})
SC.player.distance  Number of crossed mountain ridges (e.g 15)
*/

SC.levels.level1 = {
    requires: 0,
    objective: ["Pop 10 balloons", "", "⭐ finish level", "⭐⭐ under 10s", "⭐⭐⭐ under 9s"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({balloons: 10});
    },
    hit: function () {
        SC.progress.balloons();
        return SC.player.total >= 10;
    },
    stars: function () {
        if (SC.time < 9) {
            return 3;
        }
        if (SC.time < 10) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level2 = {
    requires: 1,
    objective: ["Pop 20 balloons under 30s", "", "⭐ finish level", "⭐⭐ under 20s", "⭐⭐⭐ under 25s"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({balloons: 20, time: 30});
    },
    mountain: function () {
        SC.progress.time(true);
        if (SC.time >= 30) {
            SC.onFail();
        }
        return false;
    },
    hit: function () {
        SC.progress.balloons();
        return SC.player.total >= 20;
    },
    stars: function () {
        if (SC.time < 25) {
            return 3;
        }
        if (SC.time < 20) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level3 = {
    requires: 2,
    objective: ["Pop 30 balloons", "", "⭐ finish level", "⭐⭐ under 30s", "⭐⭐⭐ under 40s"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({balloons: 30});
    },
    hit: function () {
        SC.progress.balloons();
        return SC.player.total >= 30;
    },
    stars: function () {
        if (SC.time < 40) {
            return 3;
        }
        if (SC.time < 30) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level4 = {
    requires: 3,
    objective: ["Pop 10 balloons and at least 3 blue", "", "⭐ finish level", "⭐⭐ under 30s", "⭐⭐⭐ under 40s"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({balloons: 10, blue: 3});
    },
    hit: function () {
        SC.progress.balloons();
        SC.progress.colored('blue');
        return (SC.player.total >= 10) && (SC.player.balloons.blue >= 3);
    },
    stars: function () {
        if (SC.time < 40) {
            return 3;
        }
        if (SC.time < 30) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level5 = {
    requires: 4,
    objective: ["Pop 30 balloons and at least 10 pink and 10 green", "", "⭐ finish level", "⭐⭐ under 50s", "⭐⭐⭐ under 40s"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({balloons: 30, pink: 10, green: 10});
    },
    hit: function () {
        SC.progress.balloons();
        SC.progress.colored('pink');
        SC.progress.colored('green');
        return (SC.player.total >= 30) && (SC.player.balloons.pink >= 10) && (SC.player.balloons.green >= 10);
    },
    stars: function () {
        if (SC.time < 40) {
            return 3;
        }
        if (SC.time < 50) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level6 = {
    requires: 8,
    objective: ["Cross 30 mountains", "", "⭐ finish level", "⭐⭐ under 30s", "⭐⭐⭐ under 20s"],
    random: SC.random({black: 1, red: 1, brown: 1, yellow: 1, pink: 3}),
    init: function () {
        SC.progress.reset({mountains: 30});
    },
    mountain: function () {
        SC.progress.mountains(true);
        return SC.player.distance >= 30;
    },
    hit: SC.unused,
    stars: function () {
        if (SC.time < 30) {
            return 3;
        }
        if (SC.time < 20) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level7 = {
    requires: 10,
    objective: ["Pop 10 pink and nothing else!", "", "⭐ finish level", "⭐⭐ under 30s", "⭐⭐⭐ under 20s"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({pink: 10});
    },
    hit: function (aType) {
        if (aType !== 'pink') {
            SC.onFail();
            return false;
        }
        SC.progress.colored('pink');
        return (SC.player.balloons.pink >= 10);
    },
    stars: function () {
        if (SC.time < 30) {
            return 3;
        }
        if (SC.time < 20) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level8 = {
    requires: 12,
    objective: ["Survive for 100 seconds", "", "⭐ finish level", "⭐⭐ pop 50 balloons", "⭐⭐⭐ pop 100 balloons"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({time: 100});
    },
    mountain: function () {
        SC.progress.time(true);
        if (SC.time >= 100) {
            SC.onWin();
        }
        return false;
    },
    hit: SC.unused,
    stars: function () {
        if (SC.player.total >= 100) {
            return 3;
        }
        if (SC.player.total >= 50) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level9 = {
    requires: 15,
    objective: ["Cross 100 mountains", "", "⭐ finish level", "⭐⭐ pop 50 balloons", "⭐⭐⭐ pop 100 balloons"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({mountains: 100});
    },
    mountain: function () {
        SC.progress.mountains(true);
        if (SC.player.distance >= 100) {
            SC.onWin();
        }
        return false;
    },
    hit: SC.unused,
    stars: function () {
        if (SC.player.total >= 100) {
            return 3;
        }
        if (SC.player.total >= 50) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level10 = {
    requires: 20,
    objective: ["Pop 20 balloons before crossing 20 mountains", "", "⭐ finish level", "⭐⭐ without brown", "⭐⭐⭐ colorblind"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({balloons: 20, mountains: 20});
    },
    mountain: function () {
        SC.progress.mountains(false);
        if (SC.player.distance >= 20 && SC.player.total < 20) {
            SC.onFail();
        }
        return false;
    },
    hit: function () {
        SC.progress.balloons();
        if (SC.player.total >= 20 && SC.player.distance <= 20) {
            SC.onWin();
        }
        return false;
    },
    stars: function () {
        if (SC.player.balloons.gray > 0) {
            return 3;
        }
        if (!SC.player.balloons.brown) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level11 = {
    requires: 22,
    objective: ["Pop balloon at least every 3 seconds for 30 seconds", "", "⭐ finish level", "⭐⭐ pop 40 balloons", "⭐⭐⭐ without red"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({time: 30});
        SC.lastHitTime = 0;
    },
    mountain: function () {
        SC.progress.time(true);
        if (SC.time >= 30) {
            SC.onWin();
        }
        if (SC.time - SC.lastHitTime > 3) {
            SC.onFail();
        }
        return false;
    },
    hit: function () {
        if (!SC.lastHitTime) {
            SC.lastHitTime = SC.time;
        }
        if (SC.time - SC.lastHitTime > 3) {
            SC.onFail();
        }
        SC.lastHitTime = SC.time;
        if (SC.time >= 30) {
            SC.onWin();
        }
        return false;
    },
    stars: function () {
        if (!SC.player.balloons.red) {
            return 3;
        }
        if (SC.player.total >= 40) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level12 = {
    requires: 24,
    objective: ["Pop 30 balloons in 30 seconds", "", "⭐ finish level", "⭐⭐ pop 40 balloons", "⭐⭐⭐ without red"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({balloons: 30, time: 30});
    },
    mountain: function () {
        SC.progress.time();
        if (SC.time > 30) {
            SC.onFail();
        }
        return false;
    },
    hit: function () {
        SC.progress.balloons();
        return (SC.player.total >= 30) && (SC.time <= 30);
    },
    stars: function () {
        if (!SC.player.balloons.red) {
            return 3;
        }
        if (SC.player.total >= 40) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level13 = {
    requires: 26,
    objective: ["Pop 20 pink in 60s", "", "⭐ finish level", "⭐⭐ under 55s", "⭐⭐⭐ under 50s"],
    random: SC.random(SC.standardDistribution),
    init: function () {
        SC.progress.reset({pink: 20, time: 60});
    },
    mountain: function () {
        SC.progress.time();
        if ((SC.time > 60) && (SC.player.balloons.pink < 20)) {
            SC.onFail();
        }
        return false;
    },
    hit: function () {
        SC.progress.colored('pink');
        return (SC.time <= 60) && (SC.player.balloons.pink >= 20);
    },
    stars: function () {
        if (SC.time < 50) {
            return 3;
        }
        if (SC.time < 55) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level14 = {
    requires: 27,
    objective: ["Cross 30 mountains without hitting black", "", "⭐ finish level", "⭐⭐ pop 1 pink", "⭐⭐⭐ pop 2 pink"],
    random: SC.random({black: 10, pink: 5}),
    hitboxSizeX: 0.015,
    balloons: function () { // (aLine)
        var r = [], i, x;
        for (i = 0; i < 20; i++) {
            x = i / 20 + (Math.random() - Math.random()) / 20;
            if (x < 0.1) {
                x = 0.1;
            }
            if (x > 0.9) {
                x = 0.9;
            }
            r.push({x: x, type: 'black', visible: true});
        }
        return r;
    },
    init: function () {
        SC.progress.reset({mountains: 30});
    },
    mountain: function () {
        SC.progress.mountains(true);
        return SC.player.distance >= 30;
    },
    hit: SC.unused,
    stars: function () {
        if (SC.player.balloons.pink >= 2) {
            return 3;
        }
        if (SC.player.balloons.pink === 1) {
            return 2;
        }
        return 1;
    }
};

SC.levels.level15 = {
    requires: 28,
    objective: ["Slalom between black balloons, pop all pink balloons", "", "⭐ finish level", "⭐⭐ pop 3 green", "⭐⭐⭐ pop 5 green"],
    random: SC.random({green: 1}),
    hitboxSizeX: 0.015,
    balloons: function () { // (aLine)
        if (SC.ridgesCreated > 24) {
            return [];
        }
        if (SC.ridgesCreated % 4 === 0) {
            return [{x: 0.51, type: 'black', visible: true}, {x: 0.53, type: 'pink', visible: true}, {x: 0.6, type: 'green', visible: true}];
        }
        if (SC.ridgesCreated % 4 === 2) {
            return [{x: 0.4, type: 'green', visible: true}, {x: 0.47, type: 'pink', visible: true}, {x: 0.49, type: 'black', visible: true}];
        }
        return [];
    },
    discard: function (aRidge) {
        var i;
        for (i = 0; i < aRidge.balloons.length; i++) {
            if (aRidge.balloons[i].type === 'pink' && aRidge.balloons[i].visible) {
                SC.onFail();
                return false;
            }
        }
        return true;
    },
    init: function () {
        SC.progress.reset({mountains: 30});
    },
    mountain: function () {
        SC.progress.mountains(true);
        if ((SC.player.distance >= 30) && (SC.player.balloons.pink < 13)) {
            SC.onFail();
            return false;
        }
        return SC.player.distance >= 30;
    },
    hit: SC.unused,
    stars: function () {
        if (SC.player.balloons.green >= 3) {
            return 2;
        }
        if (SC.player.balloons.green >= 5) {
            return 3;
        }
        return 1;
    }
};

