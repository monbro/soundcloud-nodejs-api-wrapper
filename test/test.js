/**
 * EXAMPLE B
 *
 * request with having an access token
 */

var SC = require('../index');

// leave options object empty as we use an access token in this example
var sc = new SC({});

// change 'YOUR_ACCESS_TOKEN'  to make this demo work
client = sc.client({access_token : 'YOUR_ACCESS_TOKEN'});

client.get('/me', {},function(err, result, response) {
	if (err) console.error(err);

	console.log(result);
});

/**
 * EXAMPLE C
 *
 * request without having an access token
 */

// Setup, please insert your data from your app at http://soundcloud.com/you/apps to make this example work
var credentials = {
     client_id : 'xxx',
     client_secret : 'xxx',
     username : 'xxx',
     password : 'xxx'
    };

var SC = require('../index');
var sc = new SC(credentials);

// this client object will be explained more later on
var client = sc.client();

client.exchange_token(function(err, result) {

  var access_token = arguments[3].access_token;

  console.log('Full API auth response was:');
  console.log(arguments);

  // we need to create a new client object which will use the access token now
  var clientnew = sc.client({access_token : access_token});

  clientnew.get('/me', {limit : 1}, function(err, result) {
    if (err) console.error(err);
    console.log(result); // should show a json object of your soundcloud user
  });

  // lets try to create a new empty playlist
  var jsonString = '{"playlist":{"title":"My brand new Playlist"}}';
  clientnew.post('/playlists', jsonString, function(err, result) {
    if (err) console.error(err);
    console.log(result); // should show the json object of our new playlist
  });

});