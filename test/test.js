/**
 * EXAMPLE A
 *
 * request with having an access token
 */

var SC = require('../index');

// change the following credential to make this demo work
var sc = new SC({
	client_id : 'CLIENTID',
	client_secret : 'CLIENTSECRET',
	username : 'USERNAME',
	password : 'PASSWORD'
});


client = sc.client({access_token : 'ACCESS_TOKEN'});

client.get('/me/favorites', {limit : 1},function(err, result, response) {
	if (err) console.error(err);

	console.log(result);
});

/**
 * EXAMPLE B
 *
 * request without having an access token
 */
var SC = require('../index');

// change the following credential to make this demo work
var sc = new SC({
  client_id : "CLIENTID",
  client_secret : "CLIENTSECRET",
  username : 'USERNAME',
  password: 'PASSWORD'
});

var client = sc.client();

client.exchange_token(function(err, results) {

  var access_token = arguments[3].access_token;
  console.log('Our new access token "'+access_token+'" will expire in '+expires_in); // should show your new user token and when it will expire

  console.log('Full API auth response was:');
  console.log(arguments);

  // we need to create a new client object which will use the access token now
  var clientnew = sc.client({access_token : access_token});

  clientnew.get('/me', {limit : 1}, function(err, result) {
    if (err) console.error(err);
    console.log(result); // should show some data of your user
  });

});