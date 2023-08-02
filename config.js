const {config} = require('dotenv');
const con =config({
    host:process.env.HOST || "",
    database:process.env.DATABASE || "",
    user:process.env.USER || "",
    password:process.env.PASSWORD || ""
});
module.exports = con;