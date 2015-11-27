//var Promise = global.Packages.Promise;

var AuthConstants = require("../constants")(),
    model = global.__dbConfiguration.db.extend({
        tableName: "accountLookup"
    });

// overriding base method
model.prototype.getDBObject = function getDBObject(object) {

    var dbObject = {
        id: object.id,
        accountId: object.accountId,
        userId: object.userId,
        type: object.type,
        password: object.password,
        username: object.username,
        isActive: object.isActive,
        createdOn: object.createdOn,
        modifiedOn: object.modifiedOn
    };
    if(AuthConstants.enums.dbClients.mongo === global.__dbConfiguration.client) {
        dbObject._id = dbObject.id;
        delete dbObject.id;
    }
    return dbObject;
};

// overriding base method
model.prototype.getObjectFromDBObject = function getObjectFromDBObject(mongoObject) {
    // return user specific object from mongo object
    if(AuthConstants.enums.dbClients.mongo === global.__dbConfiguration.client) {
        mongoObject.id = mongoObject._id;
        delete mongoObject._id;
    }
    return mongoObject;
};

module.exports = model;