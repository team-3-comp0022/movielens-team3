//npm i -S fast-csv
const queries = require('./queries.js')
const fs = require("fs");
const fastcsv = require("fast-csv");
const util = require('util');
var mysql = require('mysql')
//var express = require('express')

const filenames = queries.filenames
const csv_queres = queries.csv_queres

var connection = mysql.createConnection({
    host: "db",
    user: "root",
    password: "example",
    database: "films",
    port: '3306'
  });


function initialise_data(){
    deleteTables()
    makeTables()
    addData()
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    sleep(4000).then(() => {
        makeSecondTables()
        makeSplitTable()
    });
}

//initialise_data()


//get query result data on frontend
// var stuff_i_want = [];
// firstQuery("Fair Game (1995)", function(result){
//     stuff_i_want = result;
//     console.log(stuff_i_want)
//  });


 //example usage
//  var solution = [];
// searchQuery("Story", function(result){
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
//  });

// secondQuery(function(result){
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
//  });

//  thirdQuery(function(result){
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
//  });

// fourthQuery(function(result){
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
//  });

// fifthQuery("Jumanji (1995)",function(result){
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
//  });

// sixthQuery("Jumanji (1995)",function(result){
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
//  });


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

function searchQuery(title, callback){
    
    let search = queries.search.replace('@', title)
    connection.query(search, function (err, rows, fields) {
        if (err) throw err
        let res = rows.map(function(X) {return X.tmdbId;})
        return callback(res);
    })
}

function firstQuery(title, callback){
    
    let caseOne = queries.case_one
    connection.query(caseOne,[title], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        console.log(rows)
        return callback(rows[0].average_rating);
    })
}

function secondQuery(callback){
    
    let caseTwo = queries.case_two
    connection.query(caseTwo, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        // console.log(rows)
        // for (let i =0; i<rows.length;i++){
        //     for (let j in rows[i]){
        //         console.log(j +": "+rows[i][j]);
        //     }
        // }
        // desired_data = rows[0];  // Scope is larger than function
        // console.log(desired_data)
        return callback(rows);
    })
}

function thirdQuery(callback){
    
    let caseThree = queries.case_three
    connection.query(caseThree, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        // console.log(rows)
        // for (let i =0; i<rows.length;i++){
        //     for (let j in rows[i]){
        //         console.log(j +": "+rows[i][j]);
        //     }
        // }
        // desired_data = rows[0];  // Scope is larger than function
        // console.log(desired_data)
        return callback(rows);
    })
}

function fourthQuery(callback){
    
    let caseFour = queries.case_four
    connection.query(caseFour, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        // console.log(rows)
        // for (let i =0; i<rows.length;i++){
        //     for (let j in rows[i]){
        //         console.log(j +": "+rows[i][j]);
        //     }
        // }
        // desired_data = rows[0];  // Scope is larger than function
        // console.log(desired_data)
        return callback(rows);
    })
}

function fifthQuery(title, callback){
    
    let caseFive = queries.case_five
    connection.query(caseFive,[title], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function sixthQuery(title, callback){
    
    let caseSix = queries.case_six
    connection.query(caseSix,[title,title,title,title,title,title], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}


//connection.end();

module.exports= {
    searchQuery,
    firstQuery,
    secondQuery,
    thirdQuery,
    fourthQuery,
    fifthQuery,
    sixthQuery
}
