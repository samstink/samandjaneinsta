var React = require("react/addons");
var $ = require("jquery");

var ImageList = React.createClass({

    render: function() {

        var createItem = function() {
            return <li>1</li>;
        };
        return <ul className="ImageList">{this.props.items.map(createItem)}</ul>;

    }

});

module.exports = ImageList;