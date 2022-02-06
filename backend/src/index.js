const queries = require('./queries.js')

var mysql = require('mysql')
var express = require('express')

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "example",
    database: "films",
    port: '8086'
  })

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

/* create tables */
// const create_list = queries.create_list

// create_list.forEach(function (query) {
//     connection.query(query, function (err, rows, fields) {
//         if (err) throw err
      
//         console.log('Success creating tables')
//       });
// });

/* delete tables */
const drop_all = queries.drop_all

connection.query(drop_all, function (err, rows, fields) {
    if (err) throw err
  
    console.log('Success')
  })


/* import csv */
// const fs = require("fs");
// const fastcsv = require("fast-csv");

// const filenames = queries.filenames
// const csv_queres = queries.csv_queres

// filenames.forEach((file, index)=>{
//     const csv_query = csv_queres[index];
//     let stream = fs.createReadStream(file);
//     let csvData = [];
//     let csvStream = fastcsv
//     .parse()
//     .on("data", function(data) {
//         csvData.push(data);
//     })
//     .on("end", function() {
//         // remove the first line: header
//         csvData.shift();
        
//         // open the connection
//         // let query =
//         //     csv_query;
//         //     connection.query(query, [csvData], (error, response) => {
//         //     console.log(error || response);
//         //     connection.end();
//         //     });
//         connection.connect(error => {
//             if (error) {
//               console.error(error);
//             } else {
//               let query =
//                 "INSERT INTO category (id, name, description, created_at) VALUES ?";
//               connection.query(query, [csvData], (error, response) => {
//                 console.log(error || response);
//               });
//             }
//         });    
//     });
//     stream.pipe(csvStream);
// });

  
connection.end();


