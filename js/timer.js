function Timer(callback, delay) {
    var animationFrame = null;
    var lastUpdate = null;
    var self = this;

    var loop = function(){
        animationFrame = requestAnimationFrame(function(){
            var now = Date.now();
            var elapsed = now - lastUpdate;
            if(lastUpdate === null || elapsed > delay){
                callback();
                lastUpdate = now - (elapsed % delay);
            }
            loop();
        });
    };

    this.start = function() {
        if(animationFrame !== null){
            return;
        }
        lastUpdate = Date.now();
        loop();
    }

    this.stop = function() {
        if(animationFrame === null){
            return;
        }
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
    }

    this.reset = function(newDelay) {
        self.stop();
        delay = newDelay;
        self.start();
    }

    this.resetForward = function(newDelay){
        self.stop();
        delay = newDelay;
        callback();
        self.start();
    }
}
