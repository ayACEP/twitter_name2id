
const React = require("react");
const ge = require("./global_event");
const storage = require("./storage");
const {Utils} = require("./utils");

class BaseReactComponent extends React.Component {

    constructor(props) {
        super(props);
        
        this.id = "";
        this.savedState = null;

        this.onSaveState = this.onSaveState.bind(this);
        this.onWindowUnload = this.onWindowUnload.bind(this);

        ge.onWindowUnload(this.onWindowUnload);
    }

    componentWillUnmount() {
        ge.removeOnWindowUnload(this.onWindowUnload);
        storage.removeItem(this.saveStateName);
    }

    setDefaultState(defaultState) {
        this.state = {};
        let savedState = this.getSavedState();
        for (var key in defaultState) {
            if (savedState[key] != null) {
                this.state[key] = savedState[key];
            } else {
                this.state[key] = defaultState[key];
            }
        }
    }

    getSavedState() {
        if (this.savedState == null) {
            this.savedState = Utils.null2NewObject(JSON.parse(storage.getItem(this.saveStateName)))
        }
        return this.savedState;
    }

    onWindowUnload() {
        this.onSaveState(Object.assign({}, this.state));
    }

    onSaveState(copyedState) {
        try {
            storage.setItem(this.saveStateName, JSON.stringify(copyedState));
        } catch (e) {
            console.error(e);
        }
    }

    get saveStateName() {
        return this.constructor.name + "_" + this.id + ".state";
    }
}

module.exports = BaseReactComponent;
