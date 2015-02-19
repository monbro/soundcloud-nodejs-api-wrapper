soundcloud-nodejs-api-wrapper
=============================

Soundcloud Nodejs API Wrapper - connect to the soundcloud API with oauth and without any callback url.
For more details check the [Soundcloud API documentation](https://developers.soundcloud.com/docs/api/reference).

Original NPM package (not maintained anymore) was [soundcloud-api](https://www.npmjs.com/package/soundcloud-api).

Documentation
=============

## Getting Started

Include the module and create a new Soundcloud object. Parameter is an object literal with the following values:
* client_id : (string) Your apps client id.
* client_secret : (string) Your apps client secret.
* redirect_uri : (string) Your apps redirect_uri.
* ssl : (boolean) If true, all API calls are HTTPS. Defaults to false.
* username : A users username. Used for Oauth's User Credentials Flow. See below.
* password : A users password. Used for Oauth's User Credentials Flow. See below.

Example A with a redirect_uri:

```js
SC = require('soundcloud-nodejs-api-wrapper');

var sc = new SC({
  client_id : 'YOUR_CLIENT_ID',
  client_secret : 'YOUR_CLIENT_SECRET',
  redirect_uri : 'YOUR_REDIRECT_URI'
});
```

Example B without using a redirect_uri and without having a access token:

```js
SC = require('soundcloud-nodejs-api-wrapper');

var sc = new SC({
  client_id : "CLIENTID",
  client_secret : "CLIENTSECRET",
  username : 'USERNAME',
  password: 'PASSWORD'
});

// this client object will be explained more later on
var client = sc.client();

client.exchange_token(function(err, result) {

  var access_token = arguments[3].access_token;
  console.log('Our new access token "'+access_token+'" will expire in '+expires_in); // should show your new user token and when it will expire

  console.log('Full API auth response was:');
  console.log(arguments);

  // we need to create a new client object which will use the access token now
  var clientnew = sc.client({access_token : access_token});

  clientnew.get('/me', {limit : 1}, function(err, result) {
    if (err) console.error(err);
    console.log(result); // should show a json object of your soundcloud user
  });

});
```

## The Client Object
Calling sc.client() will instatiate a new client object.

The client takes in an object literal defining it's properties and Oauth credentials.
* access_token : The access token obtained from Soundcloud
* ssl : You can also specify the ssl setting in the client object too.

To exchange either a refresh_token, user credentials, or a redirect code, call the client's exchange_token function.
It has an optional parameter that takes in the redirect code.

```js
client.exchange_token(code, function(err) {
  if (err) console.log(err);
  var access_token = arguments[3].access_token,
      expires_in = arguments[3].expires_in;
});
```

Currently the exchange_token function gets the redirect code as a parameter, the refresh_token from the client object, and the user credentials from the main Soundcloud object. This is a bit confusing and is likely to change is future versions.

The client object can make GET, POST, PUT, and DELETE requests. See Soundcloud's HTTP API for reference on which API paths allow which requests.
* client.get(path, filters(optional), [callback])
* client.post(path, post_body, [callback])
* client.put(path, post_body(optional), [callback])
* client.delete(path, [callback])

```js
var client = sc.client({access_token : 'VALID_ACCESS_TOKEN'});

client.get('/me', {limit : 1}, function(err, result) {
  if (err) console.error(err);
  console.log(result);
});
```

By default the client will try to treat the result as a json object and therefore to parse it via `JSON.parse()`. You can control this behaviour simply with the following commands:

```js
client.parsePlain(); // will disable the json parsing for this client object
Client.parseJson(); // will enable the json parsing for this client object, this is default
```
