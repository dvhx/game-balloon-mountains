// Main screen with button for each level and completion star rating underneath buttons
// linter: lint-js2
// globals:

var SC = window.SC || {};

SC.levelsScreen = function (aTitle, aImageLeft, aImageRight, aBackgroundImage, aLevels, aStars, aCallback, aCallbackAchievements, aLockedCallback) {
    // Main screen with levels
    "use strict";

    var div = document.createElement("div");
    var ac;
    var starsTotal = 0;
    var s;
    for (s in aStars) {
        if (aStars.hasOwnProperty(s)) {
            starsTotal += aStars[s];
        }
    }
    console.log("starsTotal", starsTotal, aStars);

    div.innerHTML = `
    <div class="gt_levels">
        <div class="head">
            <div class="spacer"></div>
            <img class="img1" src=""/>
            <h1 class="h1"></h1>
            <img class="img2" src=""/>
            <div class="spacer"></div>
        </div>
        <h2>Choose level</h2>
        <div class="levels_buttons"></div>
        <div class="levels_extra">
            <button class="levels_achievements">🏆</button>
        </div>
        <div style="height: 1cm;">&nbsp;</div>
    </div>`;

    // header
    div.getElementsByClassName("gt_levels")[0].style.backgroundImage = "url(" + aBackgroundImage + ")";
    div.getElementsByClassName("h1")[0].textContent = aTitle;
    div.getElementsByClassName("img1")[0].src = aImageLeft;
    div.getElementsByClassName("img2")[0].src = aImageRight;

    function button(aParent, aIndex, aMap, aStars, aLocked) {
        // Add single button
        var lip;
        var btn;
        var span;
        // lip
        lip = document.createElement("div");
        lip.className = "level";
        if (aLocked) {
            lip.classList.add("lock");
        }
        aParent.appendChild(lip);
        // button
        btn = document.createElement("button");
        btn.textContent = aLocked ? "🔒" : aIndex;
        btn.className = "lvl";
        btn.dataIndex = aIndex;
        btn.dataMap = aMap;
        btn.dataLocked = aLocked;
        if (!aLocked) {
            btn.onclick = function () {
                setTimeout(function () {
                    div.parentElement.removeChild(div);
                    aCallback(aMap);
                }, 200);
            };
        } else {
            btn.onclick = function () {
                var ss = "This level requires " + aLevels[aMap].requires + " stars but you only have " + starsTotal + " stars. Finish previous levels with better score to get more stars or gain stars for achievements";
                if (aLockedCallback) {
                    aLockedCallback(ss);
                } else {
                    alert(ss);
                }
            };
        }
        lip.appendChild(btn);
        // stars
        span = document.createElement("span");
        span.innerHTML = (aStars && !aLocked) ? "⭐".repeat(aStars) : "&nbsp;";
        span.id = "level_" + aMap + "_stars";
        lip.appendChild(span);
        aParent.appendChild(lip);
    }

    // all buttons
    var parent = div.getElementsByClassName("levels_buttons")[0];
    parent.textContent = "";
    var i = 0;
    var available = true;
    Object.keys(aLevels).forEach(function (k) {
        i++;
        button(parent, i, k, aStars[k], aLevels[k].requires > starsTotal);
        /*
        button(parent, i, k, aStars[k], !available);
        if (!aStars[k] || aStars[k] < 1) {
            available = false;
        }
        */
    });

    /*
    var k;
    for (k in aLevels) {
        if (aLevels.hasOwnProperty(k)) {
            i++;
            button(parent, i, k, self.stars[k], !b);
            if (!self.stars.hasOwnProperty(k) || self.stars[k] < 1) {
                b = false;
            }
        }
    }
    */

    // achievements
    ac = div.getElementsByClassName("levels_achievements")[0];
    if (aCallbackAchievements) {
        ac.addEventListener("click", aCallbackAchievements);
    } else {
        ac.style.display = "none";
    }

    document.body.appendChild(div);

    return div;
};
