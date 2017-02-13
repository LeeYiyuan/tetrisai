function Timer(callback, delay) {
    var animationFrame = null;
    var lastUpdate = null;

    var loop = function(){
        animationFrame = requestAnimationFrame(function(){
            var now = Date.now();
            var elapsed = now - lastUpdate;
            if(elapsed > delay){
                callback();
                lastUpdate = now - (elapsed % delay);
            }
            loop();
        });
    };

    this.start = function() {
        this.stop();
        lastUpdate = Date.now();
        loop();
    }

    this.stop = function() {
        if(animationFrame !== null){
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }

    this.reset = function(newDelay) {
        this.stop();
        delay = newDelay;
        this.start();
    }

    this.resetForward = function(newDelay){
        this.stop();
        callback();
        delay = newDelay;
        this.start();
    }
}

Timer.prototype.requestAnimationFrame = (function(){
    return
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

Timer.prototype.cancelAnimationFrame = (function(){
    return
        window.cancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function(animationFrame){
            window.clearTimeout(animationFrame);
        };
})();
