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

    this.currentType = "facebook";

    if(!inputObject) {
        throw new ErrorMessages.custom400Error(Util.format(AuthConstants.messages.INVALID_OBJECT_FOR, this.currentType));
    }
    if(!inputObject.token) {
        throw new ErrorMessages.custom400Error(Util.format(AuthConstants.messages.ACCESS_TOKEN_REQUIRED, "for " + this.currentType));
    }

    this.apiUrl = "https://graph.facebook.com/";
    this.requiredFailds = global.socials[this.currentType].fields || ["id","email","first_name","last_name"];
    this.requestOptionForApp = {
        uri: this.apiUrl + "/app?access_token=" + inputObject.token
    };
    this.accessToken = inputObject.token;
    this.requestOptionForMe = {
        uri: this.apiUrl + "/me?fields=" + this.requiredFailds.join(",") + "&access_token=" + inputObject.token
    }
}

facebook.prototype.validate = function validate() {

    var self = this;
    return Promise.all([
        CommonHelper.fetchUrl(self.requestOptionForApp),
        CommonHelper.fetchUrl(self.requestOptionForMe)
    ]).spread(function(appData, meData){

        appData = JSON.parse(appData);
        meData = JSON.parse(meData);
        if(appData && appData.id !== global.socials[self.currentType].key + "") {
            throw new ErrorMessages.custom400Error(AuthConstants.messages.USER_NOT_BELONG_TO_FB_AP);
        }
        return new AccountLookupModel({accountId: meData.id, type: self.currentType}).fetch().then(function(accountLookupObject){
            if(!accountLookupObject) {
                accountLookupObject = {
                    id: Id.generate(),
                    accountId: meData.id,
                    type: self.currentType,
                    password: Crypt.encrypt(self.accessToken),
                    isActive: true, //newly created user through facebook will be active by-default
                    createdOn: Epoch.now(),
                    modifiedOn: Epoch.now()
                };
                return new AccountLookupModel(accountLookupObject).save().then(function(){
                    return accountLookupObject;
                });
            }
            else if(!accountLookupObject.isActive) {
                throw new ErrorMessages.custom400Error(AuthConstants.messages.ACCOUNT_IS_DEACTIVE);
            }
            return accountLookupObject;
        });

    });

};

module.exports = facebook;