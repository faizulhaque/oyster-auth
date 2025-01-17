module.exports = {
    dbConfig: {
        mongo: {
            client: "mongo",
            host: "localhost",
            port: "27017",
            db: "oysterAuth"
        }
    },
    socials: {
        facebook: {
            key: 145649545789247,
            secret: "6a5c75d3094000a82bde89b22d2fd9af",
            fields: ["id", "email", "first_name", "last_name"]
        }
    },
    accountObject: {
        id: 1,
        accountId: "test@gmail.com",
        type: "local",
        password: "password",
        isActive: true,
        createdOn: 1,
        modifiedOn: 1
    }
};