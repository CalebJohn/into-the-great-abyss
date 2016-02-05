"use strict";

var WorldGenerator = function () {
    this.isFinished = false;
};

WorldGenerator.prototype = {
    generateWorld: function(){
        window.console.log("generator started!");
        // Put generation code in here
        window.console.log("generator finished!");
        this.isFinished = true;
    }
};