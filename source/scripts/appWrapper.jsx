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

    addTwitterToItems: function (data, media) {

        var newItems = this.state.items;

        data.time = Math.round(Date.parse(data.created_at) / 1000);
        data.img = media.media_url;
        data.url = media.url;

        newItems.unshift(data);

        this.setState({ items: newItems });

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

                newItem.time = newItem.created_time;
                newItem.img = newItem.images.standard_resolution.url;
                newItem.url = newItem.link;

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

        var initialList = [];

        this.socket.on('initialInsta', function(data) {
            console.log('first show data', data.data);
            self.createNewInstaList(data.data);
            //self.setState({ items: data.firstShow });
        });

        this.socket.on('initialTweet', function(data) {
            console.log('first tweet data', data.data);
            self.createNewTweetList(data.data);
            //self.setState({ items: data.firstShow });
        });

        this.loadCommentsFromServer();

    },


    createNewTweetList : function(list) {

        console.log('createNewTweetList', list);

        var newList = [];

        for(var i = 0; i < list.length; i++) {

            if(list[i].entities.media && list[i].entities.media[0].type == "photo") {

                var newObj = {time: '', img: '', url: ''};

                newObj.time = Math.round(Date.parse(list[i].created_at) / 1000);
                newObj.img = list[i].entities.media[0].media_url;
                newObj.url = list[i].entities.media[0].url;

                newList.push(newObj);

                if(i === list.length - 1 ) {
                    console.log('created new list');
                    this.updateList(newList);
                }
            }
        }
    },

    createNewInstaList : function(list) {

        console.log('createNewInstaList', list);

        var newList = [];

        for(var i = 0; i < list.length; i++) {

            console.log(list[i]);

            var newObj = {time: '', img: '', url: ''};

            newObj.time = list[i].created_time;
            newObj.img = list[i].images.standard_resolution.url;
            newObj.url = list[i].link;

            console.log('newObj', newObj);

            newList.push(newObj);

            if(i === list.length - 1 ) {
                console.log('created new list');
                this.updateList(newList);
            }
        }
    },

    updateList: function(list) {

        console.log('updateList');

        var initialList = this.state.items.concat(list);

        initialList.sort(function(a, b) {
            return b.time - a.time;
        });

        console.log(initialList);

        this.setState({ items: initialList });


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