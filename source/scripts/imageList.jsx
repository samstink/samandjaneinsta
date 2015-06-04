var React = require("react/addons");
var $ = require("jquery");

var ImageList = React.createClass({


    getInitialState: function () {

    },

    componentDidMount: function () {

    },


    render: function() {

        var createItem = function() {
            return <li>1</li>;
        };
        return <ul className="ImageList">{this.props.data.map(createItem)}</ul>;

    }
});


module.exports = ImageList;