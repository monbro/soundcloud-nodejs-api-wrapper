var merge = require('merge'),
	Client = require('./client'),
	oauth = require('oauth');

function SC(settings) {

	this.settings = {

		version : '0.1.1',

		host : 'api.soundcloud.com',
		ssl : settings.ssl || false,

		auth_path : '/connect',
		token_path : '/oauth2/token',
		redirect_uri : settings.redirect_uri || null,

		username : settings.username || null,
		password : settings.password || null

	};

	this.oauth = new oauth.OAuth2(settings.client_id,
		settings.client_secret,
		'https://'+this.settings.host,
		this.settings.auth_path,
		this.settings.token_path,
		null);

}

module.exports = SC;

SC.prototype.authorize_url = Client.prototype.authorize_url;

SC.prototype.client = function(options) {

	options = options || {};

	var opts = {
		host : this.settings.host,
		ssl : options.ssl || this.settings.ssl,

		redirect_uri : options.redirect_uri || this.settings.redirect_uri,

		access_token : options.access_token || null,
		refresh_token : options.refresh_token || null,

		username : this.settings.username,
		password : this.settings.password,

	}

	return new Client(opts, this.oauth);

}

SC.prototype.version = function() {
	return 'Version: ' + this.settings.version;
}