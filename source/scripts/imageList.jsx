var React = require("react/addons");
var $ = require("jquery");

var ImageList = React.createClass({

    render: function() {

        console.log(this.props);

        var createItem = function(item, index) {
            return <li><img src={item.images.low_resolution.url} /></li>;
        };

        return <ul className="ImageList">{this.props.items.map(createItem)}</ul>;

    }

});

module.exports = ImageList;