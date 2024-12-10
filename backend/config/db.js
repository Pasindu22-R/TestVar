const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "testvar",
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL connected...");
});

module.exports = db;
