// Source: https://www.youtube.com/watch?v=T8mqZZ0r-RA
const express = require('express');
const app = express();
const mysql = require('mysql');



var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "example",
    database: "films",
    port: '3306'
  });


app.get("/", (req, res) => {
    connection.ping(function (err) {
        if(err) {
          console.log("Could not connect to database! Please check config and database!");
          console.log(err)
        }
      });
    
    res.send("hello world");
})

app.listen(8090, '0.0.0.0', () => {
    console.log("Running on 8090");
});
