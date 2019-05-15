var express = require('express');
var router = express.Router();
var sql = require("mssql");
var conn = require("../connection/connect")();

var routes = function () {
        router.route('/')
        // GET
        .get(function (req, res) {

            conn.connect().then(function () {
                var sqlQuery = "Select * from Products";

                var req = new sql.Request(conn);

                req.query(sqlQuery).then(function (recordset) {
                    res.json(recordset.recordset);
                    conn.close();
                })

                    .catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while reading data");

                    });

            })

                .catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while reading data");
                });
        });

        // POST 
        router.route('/')
        .post(function (req, res) {
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductName", sql.VarChar(20), req.body.ProductName)
                    request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
                    request.execute("sp_InsertProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        })
                        .catch(function (err) {
                            conn.close();
                            res.status(400).send("1. Error while inserting data");
                        });
                    })
                    .catch(function (err) {
                        conn.close();
                        res.status(400).send("2. Error while inserting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("3. Error while inserting data");
                });
            }).catch(function (err) {
                conn.close();
                res.status(400).send("4. Error while inserting data");
            });
        });
    
        // PUT
        router.route('/:id')
        .put(function (req, res)
         {
            var _productID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductID", sql.Int, _productID)
                    request.input("ProductPrice", sql.Decimal(18, 0), req.body.ProductPrice)
                    request.execute("sp_UpdateProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).send(req.body);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while updating data");});
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while updating data");});
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while updating data");});
            }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while updating data");});
        });

        // DELETE

        router.route('/:id')
        .delete(function (req, res) {
            var _productID = req.params.id;
            conn.connect().then(function () {
                var transaction = new sql.Transaction(conn);
                transaction.begin().then(function () {
                    var request = new sql.Request(transaction);
                    request.input("ProductID", sql.Int, _productID)
                    request.execute("sp_DeleteProduct").then(function () {
                        transaction.commit().then(function (recordSet) {
                            conn.close();
                            res.status(200).json("ProductID:" + _productID);
                        }).catch(function (err) {
                            conn.close();
                            res.status(400).send("Error while Deleting data");
                        });
                    }).catch(function (err) {
                        conn.close();
                        res.status(400).send("Error while Deleting data");
                    });
                }).catch(function (err) {
                    conn.close();
                    res.status(400).send("Error while Deleting data");
                });
            })
        });
    return router;

};

module.exports = routes;