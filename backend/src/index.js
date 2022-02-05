var mysql = require('mysql')
var express = require('express')

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "example",
    database: "sys",
    port: '8086'
  })

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

const query = `
CREATE TABLE ratings (
    userId int,
    movieId int,
    rating int,
    timestamp int
)
`;

connection.query(query, function (err, rows, fields) {
    if (err) throw err
  
    console.log('Success')
  })
  
connection.end()
