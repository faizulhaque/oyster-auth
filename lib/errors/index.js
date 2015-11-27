var Util = require("util");
// add toJSON method on error object so on stringify it will be able to generate JSON
Object.defineProperty(Error.prototype, "toJSON", {
	value: function () {
		var alt = {};

		Object.getOwnPropertyNames(this).forEach(function (key) {
			alt[key] = this[key];
		}, this);

		return alt;
	},
	configurable: true
});

var ApplicationError = function (errorMessage, constructor) {

	Error.captureStackTrace(this, constructor || this);

	if (errorMessage) {
		this.message = errorMessage;
	}
	else {
		this.message = Util.format("%s: Error message was not specified.", this.name);
	}

	this.httpCode = "500";
};

Util.inherits(ApplicationError, Error);
ApplicationError.prototype.name = "Application Error";

var custom400Error = function (err) {
	this.httpCode = "400";
	this.error_message = err;
};
custom400Error.prototype.name = "custom400Error";
Util.inherits(custom400Error, ApplicationError);

var custom409Error = function (err) {
	this.httpCode = "409";
	this.error_message = err;
};
custom409Error.prototype.name = "custom409Error";
Util.inherits(custom409Error, ApplicationError);

var custom500Error = function (err) {
	this.httpCode = "500";
	this.error_message = err;
};
custom500Error.prototype.name = "custom500Error";
Util.inherits(custom500Error, ApplicationError);

module.exports = {
	ApplicationError: ApplicationError,
	custom400Error: custom400Error,
	custom409Error: custom409Error,
	custom500Error: custom500Error
};
