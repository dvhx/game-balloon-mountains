// Nice popup window with image and text and stats
"use strict";
// globals: document, window, setTimeout

var SC = window.SC || {};

SC.popup = function (aTitle, aText, aImage, aCallback, aButtons, aLargerImage, aStars, aPopped) {
    // Nice popup window with image and text and stats

    (function () {
        try {
            if (SC.noBackToChat) {
                var i;
                for (i = 0; i < aButtons.length; i++) {
                    if (aButtons[i] === 'Back to chat') {
                        aButtons[i] = 'Back to menu';
                    }
                }
            }
        } catch (e) {
            console.log('ignored', e);
        }
    }());

    var j, btn, sp = SC.splash(aTitle, aButtons, '#bceabc', function (aContent) {
        var div, img, p, i, t;

        // stats of popped balloons
        if (aPopped) {
            aContent.appendChild(SC.balloonsStats(aPopped));
        }

        // stars for level
        if (aStars) {
            aContent.appendChild(SC.stars.render(aStars, true, 'star_yes', 'star_no'));
        }

        div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        aContent.appendChild(div);

        // image or emoji
        if (aImage) {
            if (!aImage.match(/[\.]+/)) {
                // emoji
                img = document.createElement('span');
                img.textContent = aImage;
                img.style.float = 'left';
                img.style.width = '20%';
                img.style.height = '20%';
                img.style.marginRight = '1ex';
                img.style.textAlign = 'center';
                img.style.lineHeight = '100%';
                img.style.fontSize = 'xx-large';
            } else {
                // image
                img = document.createElement('img');
                img.src = aImage;
                img.style.float = 'left';
                img.style.width = '20%';
                img.style.height = '20%';
                img.style.marginRight = '1ex';
            }
            div.appendChild(img);
            if (aLargerImage) {
                img.style.width = '40%';
                img.style.marginBottom = '1ex';
            }
        }

        // text
        if (aText) {
            p = document.createElement('p');
            p.style.margin = 0;
            if (typeof aText === 'string') {
                p.appendChild(document.createTextNode(aText));
                aContent.style.overflowY = 'auto';
            } else if (Array.isArray(aText)) {
                for (i = 0; i < aText.length; i++) {
                    t = document.createElement('div');
                    if (aText[i] === '') {
                        t.innerHTML = '&nbsp;';
                    } else {
                        t.textContent = aText[i];
                    }
                    p.appendChild(t);
                }
                aContent.style.overflowY = 'auto';
            } else {
                p.appendChild(aText);
            }
            div.appendChild(p);
        }

    }, aCallback, '60vw', 'auto');

    // buttons audio feedback
    function click() {
        SC.sound.play('click');
    }

    if (sp.buttons) {
        btn = sp.buttons.getElementsByTagName('button');
        for (j = 0; j < btn.length; j++) {
            btn[j].addEventListener('click', click);
        }
    }
    /*
    */
};

