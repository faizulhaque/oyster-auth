// Mocha Test

var chai = require("chai"),
    expect = chai.expect, LocalLoginHelper, CommonHelper, accountObject,
    Config = require("../common");

describe("Local auth test", function() {

    before(function(done) {
        require("../../components/index")();
        global.__dbConfiguration = {
            db: global.Packages.Oyster.Model.initialize(Config.dbConfig.mongo),
            client: Config.dbConfig.mongo.client
        };
        LocalLoginHelper = require("../../lib/helpers/local");
        CommonHelper = require("../../lib/helpers/common");
        var AccountLookupModel = require("../../lib/models/accountLookup");
        var Crypt = global.Packages.Oyster.Utils.crypt;
        accountObject = Config.accountObject;
        var newAccountObject = JSON.parse(JSON.stringify(accountObject));
        newAccountObject.password = Crypt.encrypt(newAccountObject.password);
        return new AccountLookupModel(newAccountObject).save().then(function(){
            done();
        });

    });

    describe("Should give error on ", function(){

        it("Object creation", function(){

            try{
                var localLoginHelper = new LocalLoginHelper();
            }
            catch(error) {
                expect(error).to.be.exist;
            }

        });
        it("Object creation with empty object", function(){

            try{
                var localLoginHelper = new LocalLoginHelper({});
            }
            catch(error) {
                expect(error).to.be.exist;
            }

        });

        it("Object creation with only username", function(){

            try{
                var localLoginHelper = new LocalLoginHelper({accountId: "slkdfj"});
            }
            catch(error) {
                expect(error).to.be.exist;
            }

        });

        it("Object creation with only password", function(){

            try{
                var localLoginHelper = new LocalLoginHelper({password: "sdfsdf"});
            }
            catch(error) {
                expect(error).to.be.exist;
            }

        });

    });

    describe("Should not give error on ", function(){

        it("Object creation", function(){

            var options = {
                accountId: "abcxyz",
                password: "laksdjf"
            };
            var localLoginHelper = new LocalLoginHelper(options);
            expect(true).to.be.true;

        });

    });

    describe("Should process successfully.", function(){

        it("login with username/password", function(done){

            var localLoginHelper = new LocalLoginHelper(accountObject);
            return localLoginHelper.validate().then(function(res) {
                expect(res).to.be.exist;
                expect(res.id).to.be.equal(accountObject.id);
                expect(res.accountId).to.be.equal(accountObject.accountId);
                expect(res.type).to.be.equal("local");
                expect(res.isActive).to.be.true;
                expect(res.createdOn).to.be.equal(accountObject.createdOn);
                expect(res.modifiedOn).to.be.equal(accountObject.modifiedOn);
                done();
            }).done(null, function(error) {
                console.log("validation err: ", error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
                done();
            });

        });


    });


});