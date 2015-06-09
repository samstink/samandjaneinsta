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

                //$.each(data.tweet, function(index, tweet){

                    if(data.tweet.entities.media.length > 0) {

                        data.tweet.time = data.tweet.timestamp_ms.substring(0,10);

                        $.each(data.tweet.entities.media, function (index, media) {

                            if (media.type === "photo") {

                                self.addTwitterToItems(tweet, media);

                            }

                        });

                    }

                //});

        });

    },

    addTwitterToItems: function (data, photo) {

        var newItems = this.state.items;
        newItems.unshift(data);

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
            //self.setState({ items: data.firstShow });
        });

        /*this.socket.on('initialTweet', function(data) {
            console.log('first tweet data', data);
            //self.setState({ items: data.firstShow });
        });*/

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