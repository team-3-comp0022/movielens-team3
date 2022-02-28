// Source: https://www.youtube.com/watch?v=T8mqZZ0r-RA
const express = require('express');
const bodyParser = require("body-parser");
const pathToFrontend = __dirname +'/views/';
const app = express();
const cors = require("cors");
app.use(express.static(pathToFrontend));
var corsOptions = {
  origin: "http://localhost:3001"
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mysql = require('mysql');
//var cors = require('cors')
const { DEC8_BIN } = require('mysql/lib/protocol/constants/charsets');
const qResults = require('./query_access.js')

var connection = mysql.createConnection({
    host: "db",
    user: "root",
    password: "example",
    database: "films",
    port: '3306'
  });

 //app.use(cors());

app.get("/findMovies", (req, res) => {
  var query = "SELECT * FROM movies";
  connection.query(query, (err, result) => {
    console.log(result);
    res.send(result)
  });
  res.send
});

app.get("/search", (req, res) => {
  console.log(req.query)
  console.log(req.query.query)
  let searchData = req.query.query
  qResults.searchQuery(searchData, function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/firstQuery", (req, res) => {
  console.log(req.query)
  console.log(req.query.query)
  let firstData = req.query.query
  qResults.firstQuery(firstData, function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/secondQuery", (req, res) => {
  qResults.secondQuery(function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/thirdQuery", (req, res) => {
  qResults.thirdQuery(function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/fourthQuery", (req, res) => {
  qResults.fourthQuery(function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/fifthQuery", (req, res) => {
  console.log(req.query)
  console.log(req.query.query)
  let fifthData = req.query.query
  qResults.fifthQuery(fifthData,function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/sixthQuery", (req, res) => {
  console.log(req.query)
  console.log(req.query.query)
  let sixthData = req.query.query
  qResults.sixthQuery(sixthData,function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/", (req, res) => { // req = get info from the frontend
  res.sendFile(pathToFrontend + "index.html"); // res = response we are sending to the frontend

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
});
//require("")(app);
//const PORT = process.env.PORT || 3000;
app.listen(3001, '0.0.0.0', () => {
    console.log("Running on 3001");
});
