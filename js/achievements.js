// Achievements
"use strict";
// globals: document, window

var SC = window.SC || {};

SC.achievements = (function () {
    // Achievements
    var self = {};
    self.data = SC.storage.readObject('SC.achievements.data', {start: 0});
    self.levels = [50, 100, 500];
    self.keyLevels = {};
    self.visible = {};
    self.extraMessage = []; // Any extra message shown in next achievement

    self.callback = function (aKey, aLimit, aValue, aLevel) {
        // Overwrite this if you need to track achievements
        console.warn('achievement', aKey, aLimit, aValue, aLevel);
    };

    self.save = function () {
        // Save achievements to storage
        SC.storage.writeObject('SC.achievements.data', self.data);
        console.log('Achievements saved');
    };

    if (self.data.start === 0) {
        self.data.start = Date.now();
        self.save();
    }

    self.add = function (aKey, aValue) {
        // Add numerical value
        if (!self.data.hasOwnProperty(aKey)) {
            self.data[aKey] = 0;
        }
        var i, o = self.data[aKey], n, t;
        self.data[aKey] += aValue;
        n = self.data[aKey];
        for (i = 0; i < self.levels.length; i++) {
            t = self.keyLevels.hasOwnProperty(aKey) ? self.keyLevels[aKey][i] : self.levels[i];
            if (o < t && n >= t) {
                self.callback(aKey, t, aValue, i + 1);
            }
        }
    };

    self.addAll = function (aKeyAndValues) {
        // Add multiple numerical values at once
        var k;
        for (k in aKeyAndValues) {
            if (aKeyAndValues.hasOwnProperty(k)) {
                self.add(k, aKeyAndValues[k]);
            }
        }
        self.save();
    };

    self.show = function () {
        // Show achievements
        var aKeys = self.visible;

        function one(aParent, aImage, aValue, aTitle, aLevel, aNext, aCurValue) {
            // Render one achievement box
            var d, img, dtn, dtitle, dnext, stars;

            // box
            d = document.createElement('div');
            d.style.border = '1px solid gray';
            d.style.boxShadow = '0.2ex 0.2ex 0.5ex rgba(0,0,0,0.5)';
            d.style.margin = '1ex';
            d.style.padding = '1ex';
            d.style.display = 'flex';
            d.style.alignItems = 'center';
            switch (aLevel) {
            case -1:
                d.style.backgroundColor = '#eee';
                break;
            case 0:
                d.style.backgroundColor = '#e0b167';
                break;
            case 1:
                d.style.backgroundColor = 'silver';
                break;
            case 2:
                d.style.backgroundColor = 'gold';
                break;
            }
            d.style.borderRadius = '1ex';

            // trophy
            img = document.createElement('img');
            img.src = aImage;
            img.style.width = '1.5cm';
            img.style.height = '1.5cm';
            img.style.marginRight = '1ex';
            d.appendChild(img);

            // text box
            dtn = document.createElement('div');
            d.appendChild(dtn);

            stars = SC.stars.render(aLevel + 1, false);

            stars.style.textAlign = 'left';
            stars.style.marginBottom = '0';
            dtn.appendChild(stars);

            dtitle = document.createElement('div');
            dtitle.textContent = (aValue > 0 ? aValue + ' ' : '') + aTitle;
            dtn.appendChild(dtitle);

            dnext = document.createElement('div');
            dnext.style.opacity = 0.5;
            dnext.textContent = aNext ? 'Now: ' + (aCurValue || 0).toFixed(0) + ', Next: ' + aNext : '✔️ Completed (' + aCurValue.toFixed(0) + ')';
            dtn.appendChild(dnext);

            aParent.appendChild(d);
        }

        SC.splash('Achievements', [], '#bceabc', function (aContent) {
            var i, l, keys = Object.keys(aKeys), a, val, lev, levval, stars, image, next, t, em;

            for (i = 0; i < keys.length; i++) {
                a = keys[i];
                val = self.data[a];
                lev = -1;
                levval = 0;
                for (l = 0; l < self.levels.length; l++) {
                    t = self.keyLevels.hasOwnProperty(a) ? self.keyLevels[a][l] : self.levels[l];
                    if (val >= t) {
                        lev = l;
                        levval = t;
                    }
                }
                stars = (lev || 0) + 1;
                image = 'image/achievement/achievement0.png';
                if (stars > 0) {
                    image = 'image/achievement/' + a + '_' + stars + '.png';
                }
                next = self.keyLevels.hasOwnProperty(a) ? self.keyLevels[a][lev + 1] : self.levels[lev + 1];
                //console.log('a', a, 'stars', stars, 'lev', lev, 'val', val, 'levval', levval, 'key', aKeys[a], 'image', image, 'next', next);
                one(aContent, image, levval, aKeys[a], lev, next, val);
            }
            aContent.style.overflowY = 'scroll';
            // extra message
            console.log('extra message', self.extraMessage);
            if (self.extraMessage.length > 0) {
                console.log('using extra message', self.extraMessage);
                em = document.createElement('div');
                em.textContent = self.extraMessage.join('. ');
                aContent.appendChild(em);
                self.extraMessage = [];
            }
        }, null, '80vw', '80vh');
    };

    self.stars = function () {
        // Return sum of all stars for all achievements
        var i, l, keys = Object.keys(self.visible), a, val, lev, stars, t, sum = 0;

        for (i = 0; i < keys.length; i++) {
            a = keys[i];
            val = self.data[a];
            lev = -1;
            for (l = 0; l < self.levels.length; l++) {
                t = self.keyLevels.hasOwnProperty(a) ? self.keyLevels[a][l] : self.levels[l];
                if (val >= t) {
                    lev = l;
                }
            }
            stars = (lev || 0) + 1;
            sum += stars;
        }
        return sum;

    };

    return self;
}());


