// Mocha Test

var chai = require("chai"),
    expect = chai.expect, FaceBookHelper, FacebookTokenUrl, FacebookTestUsersUrl, CommonHelper,
    Config = require("../common");

describe("Facebook auth test", function() {

    before(function() {
        require("../../components/index")();
        global.__dbConfiguration = {
            db: global.Packages.Oyster.Model.initialize(Config.dbConfig.mongo),
            client: Config.dbConfig.mongo.client
        };
        global.socials = {
            facebook: Config.socials.facebook
        };
        FaceBookHelper = require("../../lib/helpers/facebook");
        CommonHelper = require("../../lib/helpers/common");
        FacebookTokenUrl = 'https://graph.facebook.com/oauth/access_token?client_id=' + global.socials.facebook.key +'&client_secret=' + global.socials.facebook.secret + '&grant_type=client_credentials';
        FacebookTestUsersUrl = 'https://graph.facebook.com/v2.5/'+ global.socials.facebook.key  + '/accounts/test-users?';
    });

    describe("Should give error on ", function(){

        it("Object creation", function(){

            try{
                var fbHelper = new FaceBookHelper();
            }
            catch(error) {
                expect(error).to.be.exist;
            }

        });
        it("Object creation with empty object", function(){

            try{
                var fbHelper = new FaceBookHelper({});
            }
            catch(error) {
                expect(error).to.be.exist;
            }

        });

    });

    describe("Should not give error on ", function(){

        it("Object creation", function(){

            var options = {
                username: "abcxyz"
            };
            var fbHelper = new FaceBookHelper(options);
            expect(true).to.be.true;

        });

    });

    describe("Should process successfully.", function(){

        it("login with facebook", function(done){

            this.timeout(60000);
            return CommonHelper.fetchUrl({uri: FacebookTokenUrl}).then(function(fbAppAccessToken) {
                expect(fbAppAccessToken).to.be.exist;
                return CommonHelper.fetchUrl({uri: FacebookTestUsersUrl + fbAppAccessToken}).then(function(fbTestUsers) {
                    fbTestUsers = JSON.parse(fbTestUsers);
                    var fbUser = fbTestUsers.data[CommonHelper.getRandomInt(0, fbTestUsers.data.length-1)];
                    expect(fbUser).to.be.exist;
                    var fbLoginObject = {
                        username: fbUser.access_token
                    };
                    var fbHelper = new FaceBookHelper(fbLoginObject);
                    return fbHelper.validate().then(function(res) {
                        expect(res).to.be.exist;
                        expect(res.id).to.be.a("number");
                        expect(res.accountId).to.be.equal(parseInt(fbUser.id));
                        expect(res.userId).to.be.a("number");
                        expect(res.type).to.be.equal("facebook");
                        expect(res.isActive).to.be.true;
                        expect(res.createdOn).to.be.a("number");
                        expect(res.modifiedOn).to.be.a("number");
                        done();
                    });
                });
            }).done(null, function(error) {
                console.log("validation err: ", error);
                expect(false).to.be.true; // to fail test as it should not come in this callback
                done();
            });

        });


    });


});