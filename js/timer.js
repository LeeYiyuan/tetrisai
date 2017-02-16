function Timer(callback, delay) {
    var animationFrame = null;
    var lastUpdate = null;

    var requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                return window.setTimeout(callback, 1000 / 60);
            };
    })();

    var cancelRequestAnimFrame = (function() {
        return window.cancelAnimationFrame          ||
            window.webkitCancelRequestAnimationFrame    ||
            window.mozCancelRequestAnimationFrame       ||
            window.oCancelRequestAnimationFrame     ||
            window.msCancelRequestAnimationFrame        ||
            clearTimeout;
    })();

    var loop = function(){
        animationFrame = requestAnimFrame(function(){
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
            cancelRequestAnimFrame(animationFrame);
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
