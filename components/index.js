function loadPackages() {
    var packages = {};
    packages.Promise = require("bluebird");
    packages.Lodash = require("lodash");
    packages.Oyster = require("node-oyster");
    global.Packages = packages;
}

module.exports = loadPackages;