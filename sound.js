/**
 * Created by liangweibin on 14-2-10.
 */
var Sound = function (ctx) {
    if (!ctx) {
        var Ctx = window.webkitAudioContext ? window.webkitAudioContext : window.AudioContext;
        ctx = new Ctx();
    }
    this.ctx = ctx;
    this.src = null;
    this.buffer = null;
    this.isLoaded = false;
    this.load = function (src, callback) {
        this.src = src;
        var request = new XMLHttpRequest();
        var that = this;
        request.open('GET', this.src, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            that.ctx.decodeAudioData(request.response, function (buffer) {
                that.buffer = buffer;
                that.isLoaded = true;
                if (typeof callback === 'function') {
                    callback(buffer);
                }
            }, function(){
                //decode fail
                alert('source not support');
            });
        };
        request.send();
    };
    this.volume = 1;
    this.loop = false;
    this.loopStart = 0;
    this.loopEnd = 0;

    this.volumeNode = null;
    this.sourceNode = null;

    this.destinationNode = ctx.destination;
};

Sound.prototype.play = function () {
    if (this.isLoaded) {
        var source = this.ctx.createBufferSource();
        source.buffer = this.buffer;
        this.volumeNode = this.ctx.createGain();
        this.volumeNode.gain.value = this.volume;
        source.loopStart = this.loopStart;
        source.loopEnd = this.loopEnd;
        source.loop = this.loop;
        source.connect(this.volumeNode);
        this.volumeNode.connect(this.destinationNode);
        source.start(0);
        this.sourceNode = source;
    }
};

Sound.prototype.stop = function () {

};

Sound.prototype.setVolume = function (volume) {
    this.volume = volume;
    if (this.volumeNode) {
        this.volumeNode.gain.value = volume;
    }
};

Sound.prototype.setLoop = function (loopStart, loopEnd) {
    if (loopStart === false) {
        this.loop = false;
    } else {
        this.loop = true;
        this.loopStart = loopStart;
        this.loopEnd = loopEnd;
    }
    if (this.sourceNode) {
        this.sourceNode.loopStart = this.loopStart;
        this.sourceNode.loopEnd = this.loopEnd;
        this.sourceNode.loop = this.loop;
    }
};

Sound.prototype.setOutput = function (outputNode) {
    this.destinationNode = outputNode;
};