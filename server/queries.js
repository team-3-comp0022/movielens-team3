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
    timestamp int,
    PRIMARY KEY (userId, movieId)
    )
`,`
CREATE TABLE links (
    movieId int PRIMARY KEY,
    imdbId int,
    tmdbId int
)
`,`
CREATE TABLE movies (
    movieId int PRIMARY KEY,
    title varchar(100),
    genres varchar(100)
)
`, `
CREATE TABLE tags (
    userId int,
    movieId int,
    tag varchar(100),
    timestamp int,
    PRIMARY KEY (userId, movieId) 
)
` ,`
CREATE TABLE ratings_personality (
    userid varchar(40) PRIMARY KEY,
    movie_id int,
    rating int,
    tstamp DATETIME
)
`,  `
CREATE TABLE personality_data (
    userid varchar(40) PRIMARY KEY,
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


const drop_all = `DROP TABLE IF EXISTS links, ratings, movies, tags, ratings_personality, personality_data, movies_titles, movies_genres, movies_genres_sep`


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

const create_movies_title=`
CREATE TABLE movies_titles(PRIMARY KEY(movieId)) AS 
(SELECT movieId, title FROM films.movies)` 
 
const create_movies_genre=`
CREATE TABLE movies_genres(PRIMARY KEY(movieId)) AS 
(SELECT movieId, genres FROM films.movies)` 


const create_movies_genres_sep=`
CREATE TABLE movies_genres_sep(PRIMARY KEY (movieId, genre)) AS 
(select 
films.movies_genres.movieId, 
SUBSTRING_INDEX(SUBSTRING_INDEX(films.movies_genres.genres, '|', numbers.n), '|', -1) genre 
from 
(select 1 n union all 
select 2 union all select 3 union all 
select 4 union all select 5) numbers INNER JOIN films.movies_genres 
on CHAR_LENGTH(films.movies_genres.genres) 
-CHAR_LENGTH(REPLACE(films.movies_genres.genres, '|', ''))>=numbers.n-1 
order by 
films.movies_genres.movieId, n); 
`
const search =`
SELECT links.imdbId FROM links where links.movieId IN (
  SELECT movies_titles.movieId FROM movies_titles WHERE movies_titles.title LIKE "%@%")
`

// //substitute the Fair Game for %s
const case_one = `
SELECT MT.movieID, AVG(R.rating) as average_rating 
FROM films.movies_titles MT, films.ratings R 
WHERE MT.title = ? and MT.movieID = R.movieId
GROUP BY MT.movieID;
`;

//rate movies by average popularity
const case_two = `
SELECT MT.title, AVG(R.rating) as average_rating
FROM films.movies_titles MT, films.ratings R 
WHERE MT.movieID = R.movieID 
GROUP BY MT.title 
ORDER BY AVG(R.rating) DESC; 
`;


// //polarity
const case_three = `
SELECT MG.genre, variance(R.rating) as VR 
FROM films.movies_genres_sep MG, films.ratings R 
WHERE MG.movieId = R.movieId 
GROUP BY MG.genre 
ORDER BY VR DESC
`;

//predict how a film
const case_four = `
SELECT hello.title, AVG(hello.rating), ABS(averages.avg_rating - hello.rating) as difference 
FROM ( 
SELECT R.userId, R.movieId, MT.title, SUBSTRING_INDEX(SUBSTRING_INDEX(MT.title, '(', -1), ')', 1) as year, FROM_UNIXTIME(R.timestamp) as rating_time_stamp, R.rating 
FROM films.ratings R, films.movies_titles MT 
WHERE R.movieId = MT.movieId  
AND SUBSTRING_INDEX(SUBSTRING_INDEX(MT.title, '(', -1), ')', 1) = YEAR(FROM_UNIXTIME(R.timestamp)) 
) AS hello, (SELECT MT.movieId, AVG(R.rating) as avg_rating 
FROM films.movies_titles MT, films.ratings R  
WHERE MT.movieId = R.movieId 
GROUP BY MT.movieId  
ORDER BY AVG(R.rating) DESC) AS averages 
WHERE hello.movieId = averages.movieId 
GROUP BY hello.title, difference ; 
`;

const case_five = `
SELECT AVG(P.openness) as Openness, AVG(P.agreeableness) As Agreeableness, AVG(P.emotional_stability) AS Emotional_stability, AVG(P.conscientiousness) AS Conscientiousness, AVG(P.extraversion) AS Extraversion 
FROM films.personality_data P JOIN films.ratings_personality R on P.userid = R.userId 
WHERE P.userId IN (SELECT DISTINCT R.userId FROM films.ratings_personality R, films.movies M WHERE M.title=? AND R.movie_id = M.movieId AND R.rating >= 4); `;

const case_six = `
SELECT AVG(P.openness) as Openness, AVG(P.agreeableness) As Agreeableness, AVG(P.emotional_stability) AS Emotional_stability, AVG(P.conscientiousness) AS Conscientiousness, AVG(P.extraversion) AS Extraversion FROM films.personality_data P 
WHERE P.movie_1 in (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
OR P.movie_2 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
OR P.movie_3 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
OR P.movie_4 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
OR P.movie_5 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
OR P.movie_6 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?));
`;



module.exports = {create_list, drop_all, filenames, csv_queres, case_one, case_two, case_three, case_four,case_five,case_six, create_movies_genre, create_movies_title, create_movies_genres_sep, search}