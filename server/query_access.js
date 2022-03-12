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
    sleep(40000).then(() => {
        makeSecondTables()
        makeSplitTable()
    });
    sleep(4000).then(() => {
        makeYearTable()
    });
}

// var stuff_i_want = [];
// getReportData(862, function(result){
//    stuff_i_want = result;
//    console.log("here")
//    console.log(stuff_i_want)
// });

initialise_data()

//TESTNG FIFTH QUEREY AND SIXTH QUERY

// fifthQuery("0114709",function(result){
//     console.log("FIFTH QUERY--------------------------------------------------")
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
// });

// sixthQuery("0114709",function(result){
//     console.log("SIXTH QUERY--------------------------------------------------")
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
// });

//firstQueryExample
//category is film category, type is filter type, order is ASC/DESC(CHANGE?)
//rating
//year
//alphabetical

/*
var stuff_i_want = [];
firstQuery("Action","alphabetical","desc",function(result){
    stuff_i_want = result;
    console.log("here")
    console.log(stuff_i_want)
 });
*/

//first query with year takes values (greater than first, less than second)
/*
var stuff_i_want = [];
firstQuery(["Action",20,4000],"year","desc",function(result){
    stuff_i_want = result;
    console.log("here")
    console.log(stuff_i_want)
 });
*/

//test genre
//var stuff_i_want = [];
//getFilmInGenre("Action",function(result){
//    stuff_i_want = result;
//    console.log("here")
//    console.log(stuff_i_want)
// });


//get new second query

// var stuff_i_want = [];
// secondQuery(862, function(result){//0114709
//    stuff_i_want = result;
//    console.log("here")
//    console.log(stuff_i_want)
// });

//get query result data on frontend
// var stuff_i_want = [];
// firstQuery("Fair Game (1995)", function(result){
//     stuff_i_want = result;
//     console.log(stuff_i_want)
//  });


 //example usage
 // var solution = [];
 //searchQuery("Story", function(result){
 //    solution = result;//returns array of Ids
 //    console.log(solution)//use it
 // });

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

/* create tables */
function makeYearTable(){
    const create_movies_years = queries.create_movies_years

    connection.query(create_movies_years, function (err, rows, fields) {
        if (err) throw err
        
        console.log('Success creating tables')
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

function searchQuery(keyword, callback){
    
    let search = queries.search.replace('@', keyword)
    console.log(search)
    connection.query(search, function (err, rows, fields) {
        if (err) throw err
        return callback(rows);
    })
}
/*
function firstQuery(title, callback){
    
    let caseOne = queries.case_one
    connection.query(caseOne,[title], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        console.log(rows)
        return callback(rows[0].average_rating);
    })
}
*/

//category is film category, type is filter type, order is ASC/DESC(CHANGE?)
function firstQuery(category, type, order,callback){//CATEGORY ALSO HAS FILM DATA 
    let caseOne=queries.baseOne
    if (type=="rating"){
        caseOne += queries.baseROne
    }
    caseOne+= queries.baseTwo
    if(type=="rating"){
        caseOne += queries.baseRating
    }
    else if (type=="year"){
        
        caseOne += queries.baseYear
    }
    else if (type=="alphabetical"){
        caseOne +=queries.baseAlpha
    }
    if(order == "desc"){
        caseOne += queries.desc
    }

    console.log(caseOne)

    connection.query(caseOne,category, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        console.log(rows)
        return callback(rows);
    })
}

/*
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
*/

function secondQueryOne(val, callback){
    
    let caseTwoPartOne = queries.case_two_part_one
    connection.query(caseTwoPartOne, [val], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function secondQueryTwo(val, callback){
    
    let caseTwoPartTwo = queries.case_two_part_two
    connection.query(caseTwoPartTwo, [val], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function secondQuery(val, callback){
    first=[]
    second=[]
    secondQueryOne(val, function(result){
        first = result;
        console.log(first)
        secondQueryTwo(val, function(result){
            second = result;
            console.log(first, second)
            return callback([first, second])
         });
     });
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

function fourthQuery(val,callback){
    
    let caseFour = queries.case_four
    connection.query(caseFour,[val], function (err, rows, fields) {
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
    connection.query(caseFive,[title,title], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function sixthQuery(title, callback){
    
    let caseSix = queries.case_six
    connection.query(caseSix,[title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title,title], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function getGenre(callback){
    
    let getGen = queries.getGenres
    connection.query(getGen, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function getFilmInGenre(title, callback){
    
    let getGenresFilms = queries.getFilmsinGenre
    console.log(getGenresFilms)
    connection.query(getGenresFilms,[title], function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function getReportData(val, callback){
    queryTwo=[]
    queryFour=[]
    queryFive=[]
    querySix=[]
    secondQuery(val, function(result){
        queryTwo = result;
        console.log(queryTwo)
        fourthQuery(val, function(result){
            queryFour = result;
            console.log(queryFour)
            fifthQuery(val, function(result){
                queryFive = result;
                console.log(queryFive)
                sixthQuery(val, function(result){
                    querySix = result;
                    console.log(querySix)
                    return callback([queryTwo, queryFour,queryFive,querySix])
                 });
             });
         });
     });
}

module.exports= {
    searchQuery,
    firstQuery,
    secondQuery,
    thirdQuery,
    fourthQuery,
    fifthQuery,
    sixthQuery,
    getGenre,
    getFilmInGenre
}
