var Request = require("request-promise"),
    Util = require("util"),
    Rules = global.Packages.Oyster.Helpers.rules,
    ValidationHelper = global.Packages.Oyster.Helpers.validation,
    AuthConstants = require("../constants")();

/**
 *
 * Wrapper on http request
 *
 * @param requestOptions
 * @returns {*}
 */
function fetchUrl(requestOptions) {

    var rules = new Rules();
    rules.addMulti([{
        uri: {
            required: true
        }
    }]);
    rules.addCustomSync(Util.format(AuthConstants.messages.INVALID_DATA, "qs"), function(){
        if(requestOptions.qs) {
            return _.isObject(requestOptions.qs);
        }
        else {
            return true;
        }
    });
    rules.addCustomSync(Util.format(AuthConstants.messages.INVALID_DATA, "headers"), function(){
        if(requestOptions.headers) {
            return _.isObject(requestOptions.headers);
        }
        else {
            return true;
        }
    });
    rules.addCustomSync(Util.format(AuthConstants.messages.INVALID_DATA, "body"), function(){
        if(requestOptions.body) {
            return _.isObject(requestOptions.body);
        }
        else {
            return true;
        }
    });

    return ValidationHelper.validate(requestOptions, rules).then(function(){
        if(!requestOptions.headers) {
            requestOptions.headers = {"content-type": "application/json"};
        }
        if(!requestOptions.method) {
            requestOptions.method = "GET";
        }
        return Request(requestOptions);
    });

}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.fetchUrl = fetchUrl;
module.exports.getRandomInt = getRandomInt;