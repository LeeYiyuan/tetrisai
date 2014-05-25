function Updater(){
    this.lastUpdateTime = Date.now();
    this.deltaThreshold = 500;
    this.updateCallback = null;
    this.skipping = false;
};

Updater.prototype.onUpdate = function(callback){
    this.updateCallback = callback;
};

Updater.prototype.doUpdate = function(timestamp){
    if(this.updateCallback != null){
        this.updateCallback();
    }
    this.lastUpdateTime = timestamp;
};

Updater.prototype.checkUpdate = function(timestamp){
    var self = this;
    var delta = timestamp - this.lastUpdateTime;

    if (this.skipping || delta > this.deltaThreshold){
        this.doUpdate(timestamp);
    }


    window.requestAnimationFrame(function(){
        self.checkUpdate(Date.now());
    });
};
