var React = require("react/addons");
var $ = require("jquery");
var io = require("socket.io-client");
var ImageList = require("./imageList.jsx");

var AppWrapper = React.createClass({


    getInitialState: function () {

        return { items: [] };

    },


    loadCommentsFromServer: function () {

        var self = this;

        this.socket.on('show', function(data) {
            var url = data.show;
            $.ajax({
                url: url,
                type: 'POST',
                crossDomain: true,
                dataType: 'jsonp'
            }).done(function (data) {
                //self.renderTemplate(data);
                console.log('socket response', data);
                self.setState({ data: data });
            });
        });

    },


    componentDidMount: function () {

        this.socket = io.connect(this.props.url);

        this.loadCommentsFromServer();

    },


    render: function () {

        return (
            <div className="AppWrapper">
                <h1>Welcome</h1>
                <ImageList items={this.state.items} />
            </div>
        );

    }
});


module.exports = AppWrapper;