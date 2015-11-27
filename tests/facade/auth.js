// Mocha Test

var chai = require("chai"),
    expect = chai.expect, AuthFacade,
    Config = require("../common"), authModule;

describe("Auth test", function() {

    before(function() {
        authModule = require("../../index").initialize(Config.dbConfig.mongo);
        global.socials = {
            facebook: Config.socials.facebook
        };
    });

    describe("Should process successfully.", function(){

        it("login", function(done){

            return new authModule().authenticate({
                type: Config.accountObject.type,
                accountId: Config.accountObject.accountId,
                password: Config.accountObject.password
            }).then(function(resp) {
                console.log("resp", resp);
                expect(resp).to.be.exist;
                done();
            }).done(null, function(error) {
                console.log("validation err: ", error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
                done();
            });

        });


    });


});