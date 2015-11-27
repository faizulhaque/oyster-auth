var _ = global.Packages.Lodash,
    Id = global.Packages.Oyster.Utils.id,
    Epoch = global.Packages.Oyster.Utils.epoch,
    Crypt = global.Packages.Oyster.Utils.crypt,
    Promise = global.Packages.Promise,
    CommonHelper = require("./common"),
    ErrorMessages = require("../errors"),
    AccountLookupModel = require("../models/accountLookup"),
    AuthConstants = require("../constants")(),
    Util = require("util");

function facebook(inputObject) {
    //constructor

    this.currentType = "local";

    if(!inputObject) {
        throw new ErrorMessages.custom400Error(Util.format(AuthConstants.messages.INVALID_OBJECT_FOR, this.currentType));
    }
    if(!inputObject.username) {
        throw new ErrorMessages.custom400Error(Util.format(AuthConstants.messages.REQUIRED, "username"));
    }
    if(!inputObject.password) {
        throw new ErrorMessages.custom400Error(Util.format(AuthConstants.messages.REQUIRED, "password"));
    }
    this.loginObject = {
        username: inputObject.username,
        password: Crypt.encrypt(inputObject.password),
        type: this.currentType
    };

}

facebook.prototype.validate = function validate() {

    var self = this;
    return new AccountLookupModel(self.loginObject).fetch().then(function(accountLookupObject){
        if(!accountLookupObject) {
            throw new ErrorMessages.custom400Error(AuthConstants.messages.INVALID_USERNAME_PASSWORD);
        }
        else if(!accountLookupObject.isActive) {
            throw new ErrorMessages.custom400Error(AuthConstants.messages.ACCOUNT_IS_DEACTIVE);
        }
        return accountLookupObject;
    });

};

module.exports = facebook;