var React = require("react/addons");
var $ = require("jquery");

var ImageList = React.createClass({

    render: function() {

        var createItem = function(item, index) {
            return <li className="ImageList-item" ><img className="ImageList-image" src={item.images.low_resolution.url} /></li>;
        };

        return <ul className="ImageList">{this.props.items.map(createItem)}</ul>;

    }

});

module.exports = ImageList;