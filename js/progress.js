// Show level progress in upper left corner
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.progress = (function () {
    // Show level progress in upper left corner
    var self = {};
    self.div = {};
    self.label = {};

    window.addEventListener('DOMContentLoaded', function () {
        // divs
        self.div.balloons = document.getElementById('progress_balloons');
        self.div.pink = document.getElementById('progress_pink');
        self.div.blue = document.getElementById('progress_blue');
        self.div.green = document.getElementById('progress_green');
        self.div.time = document.getElementById('progress_time');
        self.div.mountains = document.getElementById('progress_mountains');
        // labels
        self.label.balloons = document.getElementById('progress_balloons_label');
        self.label.pink = document.getElementById('progress_pink_label');
        self.label.blue = document.getElementById('progress_blue_label');
        self.label.green = document.getElementById('progress_green_label');
        self.label.time = document.getElementById('progress_time_label');
        self.label.mountains = document.getElementById('progress_mountains_label');
    });

    self.reset = function (aKeysAndValues) {
        // Reset indicators at start
        self.goal = aKeysAndValues;
        var k;
        for (k in self.div) {
            if (self.div.hasOwnProperty(k)) {
                self.div[k].style.display = aKeysAndValues.hasOwnProperty(k) ? 'flex' : 'none';
                self.label[k].textContent = aKeysAndValues.hasOwnProperty(k) ? aKeysAndValues[k] : '0';
            }
        }
        if (aKeysAndValues.hasOwnProperty('time')) {
            self.label[k].textContent += 's';
        }
        document.getElementById('progress').style.display = 'block';
    };

    self.update = function (aKey, aValue) {
        // Update one label
        self.label[aKey].textContent = aValue;
    };

    self.success = function (aKey) {
        // Mark key as completed
        self.label[aKey].textContent = '✔';
    };

    self.fail = function (aKey) {
        // Mark key as failed
        self.label[aKey].textContent = '✖';
    };

    self.time = function (aSuccess) {
        // Update remaining time
        var remaining = self.goal.time - SC.time;
        if (remaining > 0) {
            self.update('time', remaining.toFixed(0) + 's');
        } else {
            if (aSuccess) {
                self.success('time');
            } else {
                self.fail('time');
            }
        }
    };

    self.balloons = function () {
        // Update remaining balloons
        var remaining = self.goal.balloons - SC.player.total;
        if (remaining > 0) {
            self.update('balloons', remaining);
        } else {
            self.success('balloons');
        }
    };

    self.mountains = function (aSuccess) {
        // Update remaining mountains
        var remaining = self.goal.mountains - SC.player.distance;
        if (remaining > 0) {
            self.update('mountains', remaining);
        } else {
            if (aSuccess) {
                self.success('mountains');
            } else {
                self.fail('mountains');
            }
        }
    };

    self.colored = function (aKey) {
        // Update remaining colored balloon
        var remaining = self.goal[aKey] - (SC.player.balloons.hasOwnProperty(aKey) ? SC.player.balloons[aKey] : 0);
        if (remaining > 0) {
            self.update(aKey, remaining);
        } else {
            self.success(aKey);
        }
    };

    return self;
}());

