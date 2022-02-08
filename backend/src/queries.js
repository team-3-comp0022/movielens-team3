// create tables

// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//   if (err) throw err

//   console.log('The solution is: ', rows[0].solution)
// })


const create_list = [`
CREATE TABLE ratings (
    userId int,
    movieId int,
    rating int,
    timestamp int
    )
`,`
CREATE TABLE links (
    movieId int,
    imdbId int,
    tmdbId int
)
`,`
CREATE TABLE movies (
    movieId int,
    title varchar(100),
    genres varchar(100)
)
`, `
CREATE TABLE tags (
    userId int,
    movieId int,
    tag varchar(100),
    timestamp int 
)
` ,`
CREATE TABLE ratings_personality (
    userid varchar(40),
    movie_id int,
    rating int,
    tstamp DATETIME
)
`,  `
CREATE TABLE personality_data (
    userid varchar(40),
    openness double,
    agreeableness double, 
    emotional_stability double, 
    conscientiousness double, 
    extraversion double, 
    assigned_metric varchar(20), 
    assigned_condition varchar(20), 
    movie_1 int, 
    predicted_rating_1 double, 
    movie_2 int, 
    predicted_rating_2 double, 
    movie_3 int, 
    predicted_rating_3 double, 
    movie_4 int, 
    predicted_rating_4 double,
    movie_5 int, 
    predicted_rating_5 double, 
    movie_6 int, 
    predicted_rating_6 double, 
    movie_7 int, 
    predicted_rating_7 double, 
    movie_8 int, 
    predicted_rating_8 double, 
    movie_9 int, 
    predicted_rating_9 double, 
    movie_10 int, 
    predicted_rating_10 double, 
    movie_11 int, 
    predicted_rating_11 double, 
    movie_12 int, 
    predicted_rating_12 double, 
    is_personalized int, 
    enjoy_watching int
)
`];

// create_list.forEach(function (query) {
//     connection.query(query, function (err, rows, fields) {
//         if (err) throw err
      
//         console.log('Success')
//       });
// });


const drop_all = `DROP TABLE IF EXISTS links, ratings, movies, tags, ratings_personality, personality_data`

// const drop_list = [`DROP TABLE IF EXISTS links`, 
// `DROP TABLE IF EXISTS ratings`,
// `DROP TABLE IF EXISTS movies`,
// `DROP TABLE IF EXISTS tags`
// `DROP TABLE IF EXISTS ratings_personality`]

// connection.end()


// connection.query(query, function (err, rows, fields) {
//     if (err) throw err
  
//     console.log('Success')
//   })
  
// connection.end()


const filenames = ["./ml-latest-small/movies.csv","./ml-latest-small/links.csv", "./ml-latest-small/ratings.csv","./ml-latest-small/tags.csv", "./personality-isf2018/personality-data.csv","./personality-isf2018/ratings.csv"]
const csv_queres = [`INSERT IGNORE INTO movies (movieId, title, genres) VALUES ?`, 
`INSERT IGNORE INTO links (movieId, imdbId, tmdbId) VALUES ?`, 
`INSERT IGNORE INTO ratings (userId, movieId, rating, timestamp) VALUES ?`,
`INSERT IGNORE INTO tags (
    userId,
    movieId,
    tag,
    timestamp
) VALUES ?`,
`INSERT IGNORE INTO personality_data (
    userid,
    openness,
    agreeableness, 
    emotional_stability, 
    conscientiousness, 
    extraversion, 
    assigned_metric, 
    assigned_condition, 
    movie_1, 
    predicted_rating_1, 
    movie_2, 
    predicted_rating_2, 
    movie_3, 
    predicted_rating_3, 
    movie_4, 
    predicted_rating_4,
    movie_5, 
    predicted_rating_5, 
    movie_6, 
    predicted_rating_6, 
    movie_7, 
    predicted_rating_7, 
    movie_8, 
    predicted_rating_8, 
    movie_9, 
    predicted_rating_9, 
    movie_10, 
    predicted_rating_10, 
    movie_11, 
    predicted_rating_11, 
    movie_12, 
    predicted_rating_12, 
    is_personalized, 
    enjoy_watching
) VALUES ?`,
`INSERT IGNORE INTO ratings_personality (
    userid,
    movie_id,
    rating,
    tstamp
) VALUES ?`
]
/*
const fs = require("fs");
const mysql = require("mysql");
const fastcsv = require("fast-csv");
let stream = fs.createReadStream("./ml-latest-small/movies.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
    // create a new connection to the database
    const connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      database: "testdb"
    });
    // open the connection
    connection.connect(error => {
      if (error) {
        console.error(error);
      } else {
        let query =
          "INSERT INTO category (id, name, description, created_at) VALUES ?";
        connection.query(query, [csvData], (error, response) => {
          console.log(error || response);
        });
      }
    });
  });
stream.pipe(csvStream);*/









// //substitute the Fair Game for %s
// const case_one = `
// SELECT MT.movieID, AVG(R.rating) as average_rating 
// FROM films.movies_titles MT, films.ratings R 
// WHERE MT.title = "Fair Game (1995)" and MT.movieID = R.movieId;
// `;

// //rate movies by average popularity
// const case_two = `
// SELECT MT.title, AVG(R.rating) 
// FROM films.movies_titles MT, films.ratings R 
// WHERE MT.movieID = R.movieID 
// GROUP BY MT.title 
// ORDER BY AVG(R.rating) DESC; 
// `;


// //polarity
// const case_three = `
// CREATE TABLE movies_genres_sep AS 
// (select 
// films.movies_genres.movieId, 
// SUBSTRING_INDEX(SUBSTRING_INDEX(films.movies_genres.genres, '|', numbers.n), '|', -1) name 
// from 
// (select 1 n union all 
// select 2 union all select 3 union all 
// select 4 union all select 5) numbers INNER JOIN films.movies_genres 
// on CHAR_LENGTH(films.movies_genres.genres) 
// -CHAR_LENGTH(REPLACE(films.movies_genres.genres, '|', ''))>=numbers.n-1 
// order by 
// films.movies_genres.movieId, n);
// `;

// //predict how a film
// const case_four = `
// SELECT hello.title, AVG(hello.rating), averages.avg_rating, ABS(averages.avg_rating - hello.rating) as difference 

// FROM ( 

// SELECT R.userId, R.movieId, MT.title, SUBSTRING_INDEX(SUBSTRING_INDEX(MT.title, '(', -1), ')', 1) as year, FROM_UNIXTIME(R.timestamp) as rating_time_stamp, R.rating 

// FROM films.ratings R, films.movies_titles MT 

// WHERE R.movieId = MT.movieId  

// AND SUBSTRING_INDEX(SUBSTRING_INDEX(MT.title, '(', -1), ')', 1) = YEAR(FROM_UNIXTIME(R.timestamp)) 

// ) AS hello, (SELECT MT.title, AVG(R.rating) as avg_rating, MT.movieId 

// FROM films.movies_titles MT, films.ratings R  

// WHERE MT.movieId = R.movieId 

// GROUP BY MT.title  

// ORDER BY AVG(R.rating) DESC) AS averages 

// WHERE hello.movieId = averages.movieId 

// GROUP BY hello.movieId ;
// `;

module.exports = {create_list, drop_all, filenames, csv_queres}