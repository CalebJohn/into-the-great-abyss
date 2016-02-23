var WorldGenerator = function () {
    this.isFinished = false;
};

WorldGenerator.prototype = {
    generateWorld: function(){
        console.log("generator started!");
        // Put generation code in here
        console.log("generator finished!");
        this.isFinished = true;
    }
};
