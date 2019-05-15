var sql=require("mssql");

// Database connection
var connect = function()
{
var conn = new sql.ConnectionPool({

    user: "QmsReports",  
    password: "Rpt$@#1*",  
    server: "103.11.85.158",  
    database: "QmsReports"  
});
return conn;
};

module.exports = connect;
