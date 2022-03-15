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

//   `CREATE TABLE personality_user(PRIMARY KEY(userid)) AS
// (SELECT userid,agreeableness, conscientiousness, emotional_stability, extraversion, openness, assigned_condition, assigned_metric, is_personalized, enjoy_watching FROM films.personality_data);
// `,`
// CREATE TABLE personality_predictions_movies(PRIMARY KEY(userid, all_movies))
// (SELECT *
// FROM (
//     SELECT userid, movie_1 as all_movies, predicted_rating_1 as all_predictions FROM personality_data p1
//     UNION ALL SELECT userid, movie_2 as all_movies, predicted_rating_2 as all_predictions FROM personality_data p2
//     UNION ALL SELECT userid, movie_3 as all_movies, predicted_rating_3 as all_predictions FROM personality_data p3
//     UNION ALL SELECT userid, movie_4 as all_movies, predicted_rating_4 as all_predictions FROM personality_data p4
//     UNION ALL SELECT userid, movie_5 as all_movies, predicted_rating_5 as all_predictions FROM personality_data p5
//     UNION ALL SELECT userid, movie_6 as all_movies, predicted_rating_6 as all_predictions FROM personality_data p6
//     UNION ALL SELECT userid, movie_7 as all_movies, predicted_rating_7 as all_predictions FROM personality_data p7
//     UNION ALL SELECT userid, movie_8 as all_movies, predicted_rating_8 as all_predictions FROM personality_data p8
//     UNION ALL SELECT userid, movie_9 as all_movies, predicted_rating_9 as all_predictions FROM personality_data p9
//     UNION ALL SELECT userid, movie_10 as all_movies, predicted_rating_10 as all_predictions FROM personality_data p10
//     UNION ALL SELECT userid, movie_11 as all_movies, predicted_rating_11 as all_predictions FROM personality_data p11
//     UNION ALL SELECT userid, movie_12 as all_movies, predicted_rating_12 as all_predictions FROM personality_data p12
// ) as every_movie_and_prediction);
// `

function initialise_data(){
    deleteTables()
    makeTables()
    addData()
    const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
    sleep(40000).then(() => {
        makeSecondTables()
        makeSplitTable()
        splitPersonalityTables()
        
    });
    sleep(4000).then(() => {
        makeYearTable()
    });
}

/*
var stuff_i_want = [];
getReportData(862, function(result){
   stuff_i_want = result;
   console.log("here")
   console.log(stuff_i_want)
});
*/

initialise_data()
// deleteTables()

//TESTNG FIFTH QUEREY AND SIXTH QUERY

// fifthQuery("0114709",function(result){
//     console.log("FIFTH QUERY--------------------------------------------------")
//     solution = result;//returns array of Ids
//     console.log(solution)//use it
// });

// sixthQuery("862",function(result){
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
/*function addData(){
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
}*/

/* add records to tables */
function addData(){
    filenames.forEach((file, index)=>{
        const csv_query = csv_queres[index];
        let stream = fs.createReadStream(file);
        let csvData = [];
        let singleLen = 0
        //let csvStream = fastcsv
        fastcsv.parseFile(file)//parse()
        .on("data", function(data) {
            csvData.push(data);
            singleLen+=1;
        })
        .on("end", function() {
            // remove the first line: header
            csvData.shift();//remove instead?
            console.log(file)
            console.log(csvData.length)
            let query =csv_query
            //ratings has 4 columns
 
            //for(let i=0;i<csvData.length;i++){
                //"INSERT INTO category (id, name, description, created_at) VALUES ?";
 
            if(singleLen>400000){
                console.log("here")
                let bPoint=singleLen / 10///4
                for(let x=0;x<10;x++){
                    subData=csvData.slice(parseInt(x*bPoint),parseInt((x+1)*bPoint))
                    connection.query(query, [subData], (error, response) => {
                        console.log(error || response);
                   });
                }
            }else{
                connection.query(query, [csvData], (error, response) => {
                    console.log(error || response);
                })
            }
            //}
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

function splitPersonalityTables(){
    const makePersonality = queries.create_userid_movie_personality

    connection.query(makePersonality, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success in creating personality traits table')
    })

    const makePredicted = queries.create_userid_movie_predicted

    connection.query(makePredicted, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success in creating predicted tables for personality')
    })

    const deletePersonality = queries.drop_personality_data

    connection.query(deletePersonality, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Successfully deleted personality data')
    })
}

function makeSplitTable(){
    const makeFinal = queries.create_movies_genres_sep

    connection.query(makeFinal, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success in creating movies genres separated')
    })
    
    const deleteMovies = queries.drop_movie_tables
    
    connection.query(deleteMovies, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Successfully deleted movies and movies_genres')
    })    
}

function searchQuery(keyword, callback){
    //  http://localhost:3001/search?query=
    let search = queries.search + connection.escape(keyword).slice(1, -1) + `%")`;
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
//http://localhost:3001/firstQuery?query=
// function firstQuery(category, type, order,callback){//CATEGORY ALSO HAS FILM DATA 
//     let caseOne=queries.baseOne
//     if (type=="rating"){
//         caseOne += queries.baseROne
//     }
//     caseOne+= queries.baseTwo
//     if(type=="rating"){
//         caseOne += queries.baseRating
//     }
//     else if (type=="year"){
        
//         caseOne += queries.baseYear
//     }
//     else if (type=="alphabetical"){
//         caseOne +=queries.baseAlpha
//     }
//     if(order == "desc"){
//         caseOne += queries.desc
//     }

//     console.log(caseOne)

//     connection.query(caseOne,category, function (err, rows, fields) {
//         if (err) throw err
    
//         console.log('Success')
//         console.log(rows)
//         return callback(rows);
//     })
// }

function firstQuerySorting(genre, type, order, callback){
    let caseOne=queries.baseOne
    if (type=="rating" || type=="popularity"){
        caseOne += queries.baseOneWithRatingTable
    }

    if(genre != "") caseOne += queries. baseOneWithGenreTable + queries.baseTwo
    else caseOne+=  queries.baseTwoNoGenre

    if(type=="rating"){
        caseOne += queries.baseRating
    } 
    else if (type=="year"){
        caseOne += queries.baseYear
    }
    else if (type=="alphabetical"){
        caseOne +=queries.baseAlpha
    }
    else if(type=="popularity"){
        caseOne+=queries.basePopularity
    }

    if(order == "desc"){
        caseOne += queries.desc
    }

    console.log(caseOne)

    connection.query(caseOne, genre, function (err, rows, fields) {
        if (err) throw err
        console.log('Success')
        console.log(rows)
        return callback(rows);
    })
    
}

function firstQueryFiltering(category, type, order, callback){
    let caseOne=queries.baseOne
    if (type=="rating"){
        caseOne += queries.baseROne
    }
    if(typeof category == "string"){ // only the genre is defined, not the years
        if(category == "") caseOne+= queries.baseTwoNoGenre
        else caseOne+= queries.baseTwo
    }else {
        if(category[0] == "") caseOne+= queries.baseTwoNoGenre
        else caseOne+= queries.baseTwo
    }

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
    console.log(typeof category)
    console.log(category.slice(1,3))

    connection.query(caseOne, category, function (err, rows, fields) {
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

function thirdQueryPartOne(callback){
    
    let caseThreePartOne = queries.case_three_part_one
    connection.query(caseThreePartOne, function (err, rows, fields) {
        if (err) throw err
        console.log('Success')
        return callback(rows);
    })
}

function thirdQueryPartTwo(callback){
    
    let caseThreePartTwo = queries.case_three_part_two
    connection.query(caseThreePartTwo, function (err, rows, fields) {
        if (err) throw err
        console.log('Success')
        return callback(rows);
    })
}

function fourthQuery(val,callback){
    
    let caseFour = queries.case_four
    connection.query(caseFour,[val, val], function (err, rows, fields) {
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
    connection.query(caseSix,[title,title,title], function (err, rows, fields) {
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

function getTopRatedMovies(callback){
    
    let getMovies = queries.getTopRatedMovies
    connection.query(getMovies, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function getPopularMovies(callback){
    
    let getMovies = queries.getPopulardMovies
    connection.query(getMovies, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

function getPolarisingMovies(callback){
    
    let getMovies = queries.getPolarisingMovies
    connection.query(getMovies, function (err, rows, fields) {
        if (err) throw err
    
        console.log('Success')
        return callback(rows);
    })
}

//connection.end();

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
                // TODO: Change this to sixth Query!!
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
    firstQuerySorting,
    firstQueryFiltering,
    secondQuery,
    thirdQueryPartOne,
    thirdQueryPartTwo,
    fourthQuery,
    fifthQuery,
    sixthQuery,
    getGenre,
    getFilmInGenre,
    getReportData,
    getTopRatedMovies, 
    getPopularMovies, 
    getPolarisingMovies
}
