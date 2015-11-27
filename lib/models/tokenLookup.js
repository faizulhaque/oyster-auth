//var Promise = global.Packages.Promise;

var appConstants = require("../constants")(),
model = global.__dbConfiguration.db.extend({
    tableName: "tokenLookup"
});

// overriding base method
model.prototype.getDBObject = function getDBObject(object) {

    var dbObject = {
        id: object.id,
        deviceId: object.deviceId,
        platform: object.platform,
        udId: object.udId,
        userId: object.userId,
        accessToken: object.accessToken,
        createdOn: object.createdOn
    };
    if(appConstants.enums.dbClients.mongo === global.__dbConfiguration.db.client) {
        dbObject._id = dbObject.id;
        delete dbObject.id;
    }
    return dbObject;
};

// overriding base method
model.prototype.getObjectFromDBObject = function getObjectFromDBObject(mongoObject) {
    // return user specific object from mongo object
    if(appConstants.enums.dbClients.mongo === global.__dbConfiguration.db.client) {
        mongoObject.id = mongoObject._id;
        delete mongoObject._id;
    }
    return mongoObject;
};

module.exports = model;