
class GlobalEvent {
    constructor() {
        
        this.callbacks = [];

        this.onBeforeUnload = this.onBeforeUnload.bind(this);
        this.onWindowUnload = this.onWindowUnload.bind(this);
        this.removeOnWindowUnload = this.removeOnWindowUnload.bind(this);
        if (window.onbeforeunload == null) {
            window.onbeforeunload = this.onBeforeUnload;
        }
    }
    onBeforeUnload() {
        for (var i in this.callbacks) {
            try {
                this.callbacks[i]();
            } catch (e) {
                console.warn(e);
            }
        }
        // only call this once
        this.callbacks = null;
        window.onbeforeunload = null;
    }
    onWindowUnload(callback) {
        this.callbacks.push(callback);
    }
    removeOnWindowUnload(callback) {
        this.callbacks.splice(this.callbacks.indexOf(callback), 1);
    }
}

const ge = new GlobalEvent();

module.exports = ge;