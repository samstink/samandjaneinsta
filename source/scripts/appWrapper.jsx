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
                self.updateItems(data.data);

            });
        });

        this.socket.on('tweet', function(data) {
            console.log('tweet', data);
        });

    },


    updateItems: function (data) {

        var self = this;
        var newItems = this.state.items;

        $.each(data, function(newItemIndex, newItem){

            var exists = false;

            $.each(self.state.items, function(index, oldItem) {

                if(!exists && newItem.id === oldItem.id) {
                    exists = true;
                }

            });

            if(!exists) {
                console.log('adding new item :> ', newItem);
                newItems.unshift(newItem);
            }

            if(newItemIndex === data.length - 1) {
                self.setState({ items: newItems });
            }

        });

    },


    componentDidMount: function () {

        var self = this;
        this.socket = io.connect(this.props.url);

        this.socket.on('firstShow', function(data) {
            console.log('first show data', data);
            self.setState({ items: data.firstShow });
        });

        this.loadCommentsFromServer();

    },


    render: function () {

        return (
            <div className="AppWrapper">
                <ImageList items={this.state.items} />
            </div>
        );

    }
});


module.exports = AppWrapper;