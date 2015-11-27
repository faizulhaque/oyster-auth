require("./components")();

function initialize(params) {

    global.__dbConfiguration = {
        db: global.Packages.Oyster.Model.initialize(params),
        client: params.client
    };
    //should be validate, expected data as following
    //var socials = {
    //    facebook: {
    //        key: "",
    //        secret: "",
    //        fields: []
    //    },
    //    linkedin: {
    //        key: "",
    //        secret: ""
    //    },
    //    googleplus: {
    //        key: "",
    //        secret: ""
    //    }
    //};
    global.socials = params.socials;
    return require("./lib/facade/auth");
}

module.exports.initialize = initialize;
