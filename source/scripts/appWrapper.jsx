var React = require("react/addons");
var $ = require("jquery");
var io = require("socket.io-client");
//var io = require("socket.io-client").connect('https://thawing-sierra-2031.herokuapp.com');

var AppWrapper = React.createClass({


    getInitialState: function () {

        return { data: [] };
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
            });
        });

    },


    componentDidMount: function () {

        this.socket = io.connect('https://thawing-sierra-2031.herokuapp.com');

        this.loadCommentsFromServer();


    },


    render: function () {

        return (
            <div className="AppWrapper">
                <h1>Welcome</h1>
            </div>
        );
    }
});


module.exports = AppWrapper;