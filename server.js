var express = require("express");
var app = express();
var port = process.env.PORT || 3700;
var io = require('socket.io').listen(app.listen(port));
var Instagram = require('instagram-node-lib');
var Twitter = require('twitter');
var http = require('http');
var request = ('request');
//var vine = require('node-vine');
var intervalID;

/**
 * Set the paths for your files
 * @type {[string]}
 */
var pub = __dirname + '/public',
    view = __dirname + '/views';

/**
 * Set the 'client ID' and the 'client secret' to use on Instagram
 * @type {String}
 */
var clientID = 'b8d26105555b4bdea454603ccc88cb25',
    clientSecret = 'c9e45e520b2543cc91e82d84b99662e4';

/**
 * Set the configuration
 */
Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', 'https://thawing-sierra-2031.herokuapp.com/callback');
Instagram.set('redirect_uri', 'https://thawing-sierra-2031.herokuapp.com');
Instagram.set('maxSockets', 10);

var client = new Twitter({
    consumer_key: "zcmMx36qWiUcplttv0U2rh5eE",
    consumer_secret: "PdDO1NpUUS5xBFk8RuNJn5zvi6HiOKg4B6P7r8F4NSNXuPiCnL",
    access_token_key: "44387693-4TNHyJ5elWZGLbuRWiWqnlOH9AxjLatC3Mhnb2MsL",
    access_token_secret: "X98bB3c0XN3ygEHUYWz9UTkt5do5DEexQXVaJSHpWMrxZ"
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/

/*client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
        console.log(tweets);
    }
});*/

client.stream('statuses/filter', {track: '#samandjane2015'},  function(stream){

    stream.on('data', function(tweet) {
        console.log(tweet.text);
        io.sockets.emit('tweet', { tweet: tweet });
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});

client.stream('statuses/filter', {track: '#samandjane'},  function(stream){

    stream.on('data', function(tweet) {
        console.log(tweet.text);
        io.sockets.emit('tweet', { tweet: tweet });
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});




/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lollapalooza
 * @type {String}
 */
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'samandjane',
  aspect: 'media',
  callback_url: 'https://thawing-sierra-2031.herokuapp.com/callback',
  type: 'subscription',
  id: '#'
});

/**
 * Uses the library "instagram-node-lib" to Subscribe to the Instagram API Real Time
 * with the tag "hashtag" lollapalooza2013
 * @type {String}
 */
Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'samandjane2015',
  aspect: 'media',
  callback_url: 'https://thawing-sierra-2031.herokuapp.com/callback',
  type: 'subscription',
  id: '#'
});

// if you want to unsubscribe to any hashtag you subscribe
// just need to pass the ID Instagram send as response to you
Instagram.subscriptions.unsubscribe({ id: '18472495' });

// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
  io.set("transports", [
    'websocket'
    , 'xhr-polling'
    , 'flashsocket'
    , 'htmlfile'
    , 'jsonp-polling'
  ]);
  io.set("polling duration", 10);
});

/**
 * Set your app main configuration
 */
app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(pub));
    app.use(express.static(view));
    app.use(express.errorHandler());
});

/**
 * Render your index/view "my choice was not use jade"
 */
app.get("/views", function(req, res){
    res.render("index");
});

// check subscriptions
// https://api.instagram.com/v1/subscriptions?client_secret=YOUR_CLIENT_ID&client_id=YOUR_CLIENT_SECRET

/**
 * On socket.io connection we get the most recent posts
 * and send to the client side via socket.emit
 */


io.sockets.on('connection', function (socket) {

    var sj, sj15, twSJ, twSJ15 = false;

    Instagram.tags.recent({
        name: 'samandjane',
        complete: function(data) {
            sj = createNewInstaList(data);
            checkLists();
        }
    });

    Instagram.tags.recent({
        name: 'samandjane2015',
        complete: function(data) {
            sj15 = createNewInstaList(data);
            checkLists();
        }
    });

    client.get('search/tweets', {q: '#samandjane', result_type: 'recent'}, function(error, tweets, response){
        if(error) throw error;

        twSJ = createNewTweetList(tweets);
        checkLists();
    });

    client.get('search/tweets', {q: '#samandjane2015', result_type: 'recent'}, function(error, tweets, response){
        if(error) throw error;

        twSJ15 = createNewTweetList(tweets);
        checkLists();
        //io.sockets.emit('initialTweet', { data: tweets });
    });

    var createNewTweetList = function(list) {

        var newList = [];

        for(var i = 0; i < list.length; i++) {

            if(list[i].entities.media && list[i].entities.media[0].type == "photo") {

                var newObj = {time: '', img: '', url: ''};

                newObj.time = Math.round(Date.parse(list[i].created_at) / 1000);
                newObj.img = list[i].entities.media[0].media_url;
                newObj.url = list[i].entities.media[0].url;

                newList.push(newObj);

                if(i === list.length - 1 ) {
                    return newList;
                }
            }
        }
    };

    var createNewInstaList = function(list) {

        var newList = [];

        for(var i = 0; i < list.length; i++) {

            var newObj = {time: '', img: '', url: ''};

            newObj.time = list[i].created_time;
            newObj.img = list[i].images.standard_resolution.url;
            newObj.url = list[i].link;

            newList.push(newObj);

            if(i === list.length - 1 ) {
                return newList;
            }
        }
    };

    var checkLists = function() {

        if(sj !== false && sj15 !== false && twSJ !== false && twSJ15 !== false) {

            var initialList = sj.concat(sj15, twSJ, twSJ15);

            initialList.sort(function(a, b) {
                return b.time - a.time;
            });

            socket.emit('firstShow', { firstShow: initialList });

        }

    };


});


/**
 * Needed to receive the handshake
 */
app.get('/callback', function(req, res){
    var handshake =  Instagram.subscriptions.handshake(req, res);
});

/**
 * for each new post Instagram send us the data
 */
app.post('/callback', function(req, res) {
    var data = req.body;

    // Grab the hashtag "tag.object_id"
    // concatenate to the url and send as a argument to the client side
    data.forEach(function(tag) {
      var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+clientID;
      sendMessage(url);

    });
    res.end();
});

/**
 * Send the url with the hashtag to the client side
 * to do the ajax call based on the url
 * @param  {[string]} url [the url as string with the hashtag]
 */
function sendMessage(url) {
  io.sockets.emit('show', { show: url });
}

console.log("Listening on port " + port);
