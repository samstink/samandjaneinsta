var React = require("react/addons");
var $ = require("jquery");

var ImageList = React.createClass({

    render: function() {

        console.log(this.props);

        var createItem = function() {
            return <li></li>;
        };
        return <ul className="ImageList">{this.props.items.map(createItem)}</ul>;

    }

});

module.exports = ImageList;