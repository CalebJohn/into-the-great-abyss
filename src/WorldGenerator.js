/* globals planetData */

var WorldGenerator = function () {
    this.isFinished = false;
};

WorldGenerator.prototype = {
    generateWorld: function(){
        console.log("generator started!");
        
        planetData.generateMap();
        
        console.log("generator finished!");
        this.isFinished = true;
    }
};
