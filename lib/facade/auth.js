var Promise = global.Packages.Promise,
    _ = global.Packages.Lodash,
    Id = global.Packages.Oyster.Utils.id,
    Rules = global.Packages.Oyster.Helpers.rules,
    ValidationHelper = global.Packages.Oyster.Helpers.validation,
    Epoch = global.Packages.Oyster.Utils.epoch,
    Crypt = global.Packages.Oyster.Utils.crypt,
    AccountLookup = require("../models/accountLookup"),
    TokenLookup = require("../models/tokenLookup"),
    ErrorMessages = require("../errors"),
    Helpers = require("../helpers")(),
    AuthConstants = require("../constants")();

var Auth = global.Packages.Oyster.BaseFacade.extend();

/**
 *
 * Authenticate function should be called with inputObject.type/inputObject.key and inputObject.password.
 * second params could be use to add extra data into accessToken.
 *
 * @param inputObject
 * @param tokenAttributes
 * @returns {*}
 */
Auth.prototype.authenticate = function authenticate(inputObject, tokenAttributes){

    var accountObject;
    var rules = new Rules();
    rules.addMulti([{
        type: {
            required: true
        }
    }]);

    rules.addCustomSync(AuthConstants.messages.INVALID_LOGIN_TYPE, function(){
        return AuthConstants.enums.accountType[inputObject.type];
    });
    return ValidationHelper.validate(inputObject, rules).then(function() {

        rules = new Rules();
        if(inputObject.type === AuthConstants.enums.accountType.local) {
            rules.addMulti([{
                username: {
                    required: true
                }
            },{
                password: {
                    required: true
                }
            }]);
        }
        else {
            rules.addMult([{
                token: {
                    required: true
                }
            }]);
        }
        return ValidationHelper.validate(inputObject, rules).then(function(){
            var authValidation = new Helpers[inputObject.type](inputObject);
            return authValidation.validate().then(function(accountObject) {
                return setupAccessToken(inputObject, accountObject, tokenAttributes);
            });
        });

    });
};

/**
 *
 * save token object into database. (just to remove duplicate insert query).
 *
 *
 * @param tokenModel
 * @returns {*}
 */
function setupAccessToken(inputObject, accountObject, tokenAttributes) {

    var tokenObject = {
        userId: accountObject.userId,
        time: Epoch.now(),
        type: accountObject.type
    };
    var tokenModel = {
        platform: inputObject.platform,
        udId: inputObject.udId,
        userId: accountObject.userId
    };
    //add custom attributes into token object before encryption
    if(inputObject.tokenAttributes) {
        tokenObject.attributes = tokenAttributes;
    }
    var accessToken = Crypt.encrypt(JSON.stringify(tokenObject));
    var deviceId = Crypt.encrypt(JSON.stringify(tokenModel));
    tokenModel.id = Id.generate();
    tokenModel.createdOn = Epoch.now();
    tokenModel.deviceId = deviceId;
    tokenModel.accessToken = accessToken;

    //remove all previous accessToken of same platform and udId of caller user if provided
    //it will keep tokenLookup table clean
    if(inputObject.platform && inputObject.udId) {
        return new TokenLookup({deviceId: deviceId}).deleteObject().then(function(){
            return insertAccessToken(tokenModel);
        });
    }
    else {
        return insertAccessToken(tokenModel);
    }

}

/**
 *
 * save token object into database. (just to remove duplicate insert query).
 *
 *
 * @param tokenModel
 * @returns {*}
 */
function insertAccessToken(tokenModel) {
    return new TokenLookup(tokenModel).save().then(function(){
        return {
            accessToken: tokenModel.accessToken,
            userId: tokenModel.userId
        };
    });
}

/**
 *
 * Check weather access token is valid and get the decrypted object
 *
 * @param inputObject
 * @returns {*}
 */
Auth.prototype.validateAccessToken = function validateAccessToken(inputObject) {

    var tokenObject;
    var rules = new Rules();
    rules.addMulti([{
        accessToken: {
            required: true
        }
    }]);
    rules.addCustomSync(AuthConstants.messages.INVALID_USERNAME_PASSWORD, function(){
        try{
            tokenObject = Crypt.decrypt(inputObject.accessToken);
            return true;
        }
        catch(e) {
            return false;
        }
    });
    return ValidationHelper.validate(rules, inputObject).then(function(){
        return tokenObject;
    });

};

/**
 *
 * Register new user to system after validating username (could be email) and password.
 * optional params: platform/udId
 * it will return accessToken with newly created userId
 *
 * @param inputObject
 * @param tokenAttributes
 * @returns {*}
 */
Auth.prototype.register = function register(inputObject, tokenAttributes) {

    var rules = new Rules();
    rules.addMulti([{
        username: {
            required: true
        }
    }, {
        password: {
            required: true
        }
    }]);
    rules.addCustomAsync(AuthConstants.messages.USERNAME_ALREADY_EXIST, function(){
        return new AccountLookup({username: inputObject.username}).fetch().then(function(accountObject){
            return _.isObject(accountObject);
        });
    });
    return ValidationHelper.validate(rules, inputObject).then(function(){
        var userId = Id.generate();
        var accountObject = {
            id: Id.generate(),
            accountId: userId,
            userId: userId,
            type: AuthConstants.enums.accountType.local, //
            password: Crypt.encrypt(inputObject.password),
            username: inputObject.username,
            isActive: 1, //using integer 1/0 insteed of true/false
            createdOn: Epoch.now(),
            modifiedOn: Epoch.now()
        };
        return setupAccessToken(inputObject, accountObject, tokenAttributes);
    });
};




module.exports = Auth;