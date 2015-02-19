var merge = require('merge'),
	oauth = require('oauth'),
	url = require("url");

function Client(settings, oauth) {

	var defaults = {

		access_token : null,
		refresh_token : null,
		parseJson : true,

	};

	this.settings = merge(defaults, settings);

	this.oauth = oauth || new oauth.OAuth2(this.settings.client_id,
		this.settings.client_secret,
		'https://'+this.settings.host,
		this.settings.auth_path,
		this.settings.token_path,
		null);
	this.oauth.setAccessTokenName('oauth_token');

}

module.exports = Client;

Client.prototype.parseJson = function() {

	this.settings.parseJson = true;

}

Client.prototype.parsePlain = function() {

	this.settings.parseJson = false;

}

Client.prototype.use_ssl = function() {

	return !!(this.settings.ssl || this.settings.access_token);

}

Client.prototype.authorize_url = function(params) {

	params = params || {};

	if (this.settings.redirect_uri)
		params.redirect_uri = this.settings.redirect_uri;

	return this.oauth.getAuthorizeUrl(params);

}


Client.prototype.get = function(path, filters, callback) {

	//emulated overloading. Required parameters: path, callback.
	if (arguments.length == 2) {
		callback = filters;
		filters = {};
	}

	this.request('GET', path, null, filters, callback);

}

Client.prototype.post = function(path, post_body, callback) {

	this.request('POST', path, post_body, null, callback);

}

Client.prototype.put = function(path, post_body, callback) {

	if (arguments.length == 2) {
		callback = post_body;
		post_body  = {};
	}

	this.request('PUT', path, post_body, null, callback);

}

Client.prototype.delete = function(path, callback) {

	this.request('DELETE', path, null, null, callback);

}

Client.prototype.request = function(method, path, post_body, filters, callback) {

	filters = filters || {};

	filters.client_id = this.oauth._clientId;

	var req_url = {
			protocol : this.use_ssl() ? 'https:' : 'http:',
			hostname : this.settings.host,
			pathname : path,
			query : filters,
		};

	var urlString = url.format(req_url);

	var callbackJsonManipulation = function() {
		var args = arguments;
		try {
			var jsonData = JSON.parse(args[1]);
			args[1] = jsonData;
		}
		catch (e) {
			if(args[0] == null) {
				args[0] = 'Could not parse result as JSON.';
			}
		}

		// now call the original callback
		callback.apply(null, args);
	}

	// check settings if we should parse the result into a json object
	if(this.settings.parseJson) {
		oauthCallback = callbackJsonManipulation;
	} else {
		oauthCallback = callback;
	}

	this.oauth._request(method, urlString, null, post_body, this.settings.access_token, oauthCallback);

}

Client.prototype.exchange_token = function(code, callback) {

	if(arguments.length == 1) {
		callback = code;
		code = null;
	}

	var query = {
		client_id : this.oauth._clientId,
		client_secret : this.oauth._clientSecret,
	};

	if (this.settings.refresh_token) {
		query.grant_type = 'refresh_token';
		query.refresh_token = this.settings.refresh_token;
	} else if (this.settings.username && this.settings.password) {
		query.grant_type = 'password';
		query.username = this.settings.username;
		query.password = this.settings.password;
	} else if (code) {
		query.grant_type = 'authorization_code';
	}

	this.oauth.getOAuthAccessToken(code, query, callback);

}

// https://developers.soundcloud.com/blog/non-expiring-tokens
// EXPERIMENTAL FUNCTION
Client.prototype.getNewLifetimeToken = function(code, callback) {

	if(arguments.length == 1) {
		callback = code;
		code = null;
	}

	var query = {
		client_id : this.oauth._clientId,
		client_secret : this.oauth._clientSecret,
	};

	if (this.settings.refresh_token) {
		query.grant_type = 'refresh_token';
		query.refresh_token = this.settings.refresh_token;
	} else if (this.settings.username && this.settings.password) {
		query.grant_type = 'password';
		query.username = this.settings.username;
		query.password = this.settings.password;
	} else if (code) {
		query.grant_type = 'authorization_code';
	}

	query.scope = 'non-expiring';

	this.oauth.getOAuthAccessToken(code, query, callback);

}