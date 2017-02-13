function Timer(callback, delay) {
    var interval = null;

    this.start = function() {
        if (interval !== null) {
            this.stop();
        }
        interval = setInterval(callback, delay);
    }

    this.stop = function() {
        if (interval !== null) {
            clearInterval(interval);
        }
    }

    this.reset = function(newDelay) {
        delay = newDelay;
        this.stop();
        this.start();
    }

    this.resetForward = function(newDelay){
        this.stop();
        callback();
        delay = newDelay;
        this.start();
    }
}
