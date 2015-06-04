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
                self.updateItems(data.data);

            });
        });

    },


    updateItems: function (data) {


        var self = this;
        var newItems = this.state.items;

        $.each(data, function(newItemIndex, newItem){

            var exists = false;

            $.each(self.state.items.slice(0, 20), function(index, oldItem){

                if(!exists && newItem.id === oldItem.id) {
                    exists = true;
                }

            });

            if(!exists) {
                console.log('item doesnt exist');
                newItems.unshift(newItem);
            }

            if(newItemIndex === data.length - 1) {
                self.setState({ items: newItems });
            }

        });


    },


    componentDidMount: function () {

        this.socket = io.connect(this.props.url);

        this.loadCommentsFromServer();

    },


    render: function () {

        console.log(this.state.items);

        return (
            <div className="AppWrapper">
                <h1>Welcome</h1>
                <ImageList items={this.state.items} />
            </div>
        );

    }
});


module.exports = AppWrapper;