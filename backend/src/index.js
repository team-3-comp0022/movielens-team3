//npm i -S fast-csv
const queries = require('./queries.js')
const fs = require("fs");
const fastcsv = require("fast-csv");
const util = require('util');
var mysql = require('mysql')
var express = require('express')

const filenames = queries.filenames
const csv_queres = queries.csv_queres

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "example",
    database: "films",
    port: '8086'
  })
  /*
deleteTables()
makeTables()
addData()
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
sleep(4000).then(() => {
    makeSecondTables()
    makeSplitTable()
});*/


//get query result data on frontend
var stuff_i_want = [];
firstQuery("Fair Game (1995)", function(result){
    stuff_i_want = result;
    console.log(stuff_i_want)
 });


//connection.connect()
function test(){
    connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err
    //console.log(rows[0])
    console.log('The solution is: ', rows[0].solution)
    })
}

/* create tables */
function makeTables(){
    const create_list = queries.create_list

    create_list.forEach(function (query) {
        connection.query(query, function (err, rows, fields) {
            if (err) throw err
        
            console.log('Success creating tables')
        });
    });
}
/* delete tables */
function deleteTables(){
    const drop_all = queries.drop_all

    connection.query(drop_all, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
    })
}

/* add records to tables */
function addData(){
    filenames.forEach((file, index)=>{
        const csv_query = csv_queres[index];
        let stream = fs.createReadStream(file);
        let csvData = [];
        //let csvStream = fastcsv
        fastcsv.parseFile(file)//parse()
        .on("data", function(data) {
            csvData.push(data);
        })
        .on("end", function() {
            // remove the first line: header
            csvData.shift();

            let query =
                csv_query
                //"INSERT INTO category (id, name, description, created_at) VALUES ?";
            connection.query(query, [csvData], (error, response) => {
                console.log(error || response);
            });
        });
        //stream.pipe(csvStream);
    });
}

function makeSecondTables(){
    const makeSecond = queries.create_movies_genre

    connection.query(makeSecond, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
    })

    const makeThird = queries.create_movies_title

    connection.query(makeThird, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
    })
}

function makeSplitTable(){
    const makeFinal = queries.create_movies_genres_sep

    connection.query(makeFinal, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
    })
}

function firstQuery(title, callback){
    
    let caseOne = util.format(queries.case_one, title)
    connection.query(caseOne, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        console.log(rows)
        stuff_i_want = rows[0].average_rating;  // Scope is larger than function
        return callback(rows[0].average_rating);
    })
}

//connection.end();

module.exports= {
    firstQuery,
}
