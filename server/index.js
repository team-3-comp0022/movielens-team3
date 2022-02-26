// Source: https://www.youtube.com/watch?v=T8mqZZ0r-RA
const express = require('express');
const app = express();
const mysql = require('mysql');
var cors = require('cors')
const { DEC8_BIN } = require('mysql/lib/protocol/constants/charsets');


var connection = mysql.createConnection({
    host: "db",
    user: "root",
    password: "example",
    database: "films",
    port: '3306'
  });

app.use(cors());

app.get("/findMovies", (req, res) => {
  var query = "SELECT * FROM movies";
  connection.query(query, (err, result) => {
    console.log(result);
    res.send(result)
  });
  res.send
});


app.get("/", (req, res) => {
  res.send("Hi");
  var query = "INSERT INTO `links` (`movieId`, `imdbId`, `tmdbId`) VALUES ('0', '0', '0');";

  connection.ping(function (err) {
      if(err) {
        console.log("Could not connect to database! Please check config and database!");
        console.log(err)
      }
      console.log("Passed");
    });
  /*connection.query(query, (err, result) => {
      res.send("hello there");
      console.log("Done");
      console.log(result);
  })
  console.log("Hey");*/
  res.send("hello world");
})

app.listen(3001, '0.0.0.0', () => {
    console.log("Running on 3001");
});
