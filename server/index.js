// Source: https://www.youtube.com/watch?v=T8mqZZ0r-RA
const express = require('express');
const app = express();
const mysql = require('mysql');
const MysqlCache = require('mysql-cache')
var cors = require('cors')
const { DEC8_BIN } = require('mysql/lib/protocol/constants/charsets');
const qResults = require('./query_access.js')
require("dotenv").config()

const mysqlCache = new MysqlCache({
  host: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "films",
  port: '3306',
  cacheProvider: 'LRU',
});

// var connection = mysql.createConnection(mysqlCache);
var connection = mysql.createConnection({
  host: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "films",
  port: '3306',
});

app.use(cors());

app.get("/findMovies", (req, res) => {
  console.log("Yes");
  var query = "SELECT * FROM movies";
  connection.query(query, (err, result) => {
    console.log(result);
    res.send(result)
  });
  res.send
});

app.get("/findMovieIds", (req, res) => {
  var query = "SELECT imdbId FROM links INNER JOIN movies_titles ON movies_titles.movieId = links.movieId";
  connection.query(query, (err, result) => {
    res.send(result)
  });
  res.send
});

 app.get("/search", (req, res) => {
   let searchData = req.query.query;
   qResults.searchQuery(searchData, function(result){
      console.log("mysearch", result);
      res.send(result);
   });
   res.send
 });

 app.get("/getTopRatedMovies", (req, res) => {
  qResults.getTopRatedMovies(function(result){
    console.log(result)
    res.send(result)
 });
 res.send
});

app.get("/getPopularMovies", (req, res) => {
  qResults.getPopularMovies(function(result){
    console.log(result)
    res.send(result)
 });
 res.send
});

app.get("/getPolarisingMovies", (req, res) => {
  qResults.getPolarisingMovies(function(result){
    console.log(result)
    res.send(result)
 });
 res.send
});


app.get("/getGenre", (req, res) => {
  qResults.getGenre(function(result){
    console.log(result)
    res.send(result)
 });
 res.send
});

app.get("/getFilmInGenre", (req, res) => {
  let genre = req.query.query
  qResults.getFilmInGenre(genre, function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

// app.get("/firstQuery", (req, res) => {
//   qResults.firstQuery(req.query.category, req.query.type, req.query.order, function(result){
//     // qResults.firstQuery("*", "rating", "asc", function(result){
//      console.log("ressslt", result)
//      res.send(result)
//   });
//   res.send
// });

app.get("/firstQuerySorting", (req, res) => {
  qResults.firstQuerySorting(req.query.genre, req.query.type, req.query.order, function(result){
    // qResults.firstQuery(["", 2010, 2015],"year", "asc", function(result){
     console.log("ressslt", result)
     res.send(result)
  });
  res.send
});


app.get("/firstQueryFiltering", (req, res) => {
  console.log("reqqq", req.query.category)
  qResults.firstQueryFiltering(req.query.category, req.query.type, function(result){
    // qResults.firstQueryFiltering([2010, 2015],"year", function(result){
     console.log("ressslt", result)
     res.send(result)
  });
  res.send
});

app.get("/secondQuery", (req, res) => {
  qResults.secondQuery(req.query.query, function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});


app.get("/thirdQueryPartOne", (req, res) => {
  qResults.thirdQueryPartOne(function(result){
     console.log(result)
     res.send(result)
  });
  res.send
});

app.get("/thirdQueryPartTwo", (req, res) => {
  qResults.thirdQueryPartTwo(function(result){
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

app.get("/getReportData", (req, res) => {
  let reportData = req.query.query;
  qResults.getReportData(reportData, function(result){
     console.log("reportData", result);
     res.send(result);
  });
  res.send
});

app.get("/", (req, res) => {
  res.send("Hi");

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