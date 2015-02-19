soundcloud-api
==============

Soundcloud Nodejs API Wrapper - connect to the soundcloud API with oauth and without any callback url.
Soundcloud API DOCS: https://developers.soundcloud.com/docs/api/reference.

Original NPM repository (not maintained anymore) was https://www.npmjs.com/package/soundcloud-api

Documentation
=============

####Getting Started

Include the module and create a new Soundcloud object. Parameter is an object literal with the following values:
* client_id : (string) Your apps client id.
* client_secret : (string) Your apps client secret.
* redirect_uri : (string) Your apps redirect_uri.
* ssl : (boolean) If true, all API calls are HTTPS. Defaults to false.
* username : A users username. Used for Oauth's User Credentials Flow. See below.
* password : A users password. Used for Oauth's User Credentials Flow. See below.

```js
SC = require('soundcloud-api');

var sc = new SC({
  client_id : 'YOUR_CLIENT_ID',
  client_secret : 'YOUR_CLIENT_SECRET',
  redirect_uri : 'YOUR_REDIRECT_URI'
});
```

#####The Client Object
Calling sc.client() will instatiate a new client object.

The client takes in an object literal defining it's properties and Oauth credentials.
* access_token : The access token obtained from Soundcloud
* refresh_token : The refresh token obtained from Soundcloud
* ssl : You can also specify the ssl setting in the client object too.

To exchange either a refresh_token, user credentials, or a redirect code, call the client's exchange_token function.
It has an optional parameter that takes in the redirect code.

```
client.exchange_token(code, function(err, results) {
  if (err) console.log(err);
  var access_token = results.access_token,
      refresh_token = results.refresh_token,
      expires_in = results.expires_in;
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
