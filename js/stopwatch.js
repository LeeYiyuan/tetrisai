function Timer(callback) {
    var animationFrame = null;
    var startDate = null;
    var self = this;

    var loop = function(){
        animationFrame = requestAnimationFrame(function(){
            var now = Date.now();
            var elapsed = now - startDate;
            callback(elapsed);
            loop();
        });
    };

    this.start = function() {
        if(animationFrame !== null){
            return;
        }
        startDate = Date.now();
        loop();
    }

    this.stop = function() {
        if(animationFrame === null){
            return;
        }
        animationFrame = null;
    }
}
