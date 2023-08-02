const config= require('../../config');

const database = ({
    host: config.parsed.HOST,
    database:config.parsed.DATABASE,
    user: config.parsed.USER,
    password:config.parsed.PASSWORD
});

module.exports = database;