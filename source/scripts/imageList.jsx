var React = require("react/addons");
var $ = require("jquery");

var ImageList = React.createClass({

    render: function() {



        var createItem = function(item, index) {

            var media;

            if (item.type === 'video') {
              media = <video className="ImageList-video" width="640" height="640" autoPlay controls="false" loop="true" muted="true"><source src={item.video} type="video/mp4" /></video>;
            } else {
              media = <img className="ImageList-image" src={item.img} />;
            }

            return <li className="ImageList-item" ><a className="ImageList-link" href={item.url} target="_blank">{media}</a></li>;
        };

        return <ul className="ImageList">{this.props.items.map(createItem)}</ul>;

    }

});

module.exports = ImageList;