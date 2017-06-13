
const React = require("react");
const ReactDOM = require("react-dom");
const fs = require("fs");
const BaseReactComponent = require("./base_react_component");
const Nav = require("./nav");
const Content = require("./content");
const storage = require("./storage");
const utils = require("./utils");

class Main extends BaseReactComponent {

    constructor(props) {
        super(props)

        this.setDefaultState({
            names: "",
            ids: "",
            count: 0,
            total: 0,
            btnGetDisabled: "",
            btnStopDisabled: "disabled"
        })

        this.isStop = true

        this.onChange = this.onChange.bind(this)
        this.onBtnGetClick = this.onBtnGetClick.bind(this)
        this.onBtnStopClick = this.onBtnStopClick.bind(this)
        this.req = this.req.bind(this)
    }

    componentDidMount() {
    }

    onChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onBtnGetClick(e) {
        this.isStop = false
        let names = this.state.names
        let array = names.split(/\n/)
        this.setState({
            count: 0,
            total: array.length,
            ids: "",
            btnGetDisabled: "disabled",
            btnStopDisabled: ""
        });
        setTimeout(this.req, 1, array, 0)
        for (let i in array) {
            let name = array[i]
        }
    }

    onBtnStopClick(e) {
        this.isStop = true
        this.setState({
            btnGetDisabled: "",
            btnStopDisabled: "disabled"
        });

    }

    req(array, i) {
        if (this.isStop) {
            return;
        }
        if (i > array.length - 1) {
            this.setState({
                btnGetDisabled: "",
                btnStopDisabled: "disabled"
            });
            return
        }
        let name = array[i]
        $.ajax("https://twitter.com/" + name, {
            success: (data, textStatus, jqXHR) => {
                let tag = $(data).find("div.user-actions.btn-group.not-following")
                let id = $(tag).attr("data-user-id")
                let newIds = this.state.ids  + id + "\n"
                this.setState({
                    ids: newIds,
                    count: this.state.count + 1
                });
            }
        });
        setTimeout(this.req, 100, array, i + 1);
    }

    render() {
        return <div className="container">
            <div className="row form-group">
            </div>
            <div className="row">
                <div className="col-md-6 form-group">
                    <textarea className="form-control" name="names" style={{height: 500}} value={this.state.names} onChange={this.onChange} />
                </div>
                <div className="col-md-6 form-group">
                    <textarea className="form-control" name="ids" style={{height: 500}} value={this.state.ids} onChange={this.onChange} />
                    <span>{this.state.count}/{this.state.total}</span>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12 form-group">
                    <button className="btn btn-primary form-control" onClick={this.onBtnGetClick} disabled={this.state.btnGetDisabled}>get</button>
                    <button className="btn btn-primary form-control" onClick={this.onBtnStopClick} disabled={this.state.btnStopDisabled}>stop</button>
                </div>
            </div>
        </div>
    }
};

ReactDOM.render(
    <Main />,
    document.getElementById('main')
)
