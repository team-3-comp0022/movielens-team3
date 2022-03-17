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
    imdbId varchar(8),
    tmdbId int
)
`,`
CREATE TABLE movies (
    movieId int PRIMARY KEY,
    title varchar(200),
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
    userid varchar(40),
    movie_id int,
    rating int,
    tstamp DATETIME,
    PRIMARY KEY (userId, movie_id, rating, tstamp)
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


// const drop_all = `DROP TABLE IF EXISTS links, ratings, movies, tags, ratings_personality, personality_data, movies_titles, movies_genres, movies_genres_sep, movie_years,personality_predictions_movies,personality_user`
const drop_all = `DROP TABLE IF EXISTS links, ratings, movies, tags, ratings_personality, personality_data, movies_titles, movies_genres, movies_genres_sep, movie_years, personality_user, personality_predictions_movies`

const drop_movie_tables = `DROP TABLE IF EXISTS movies, movies_genres`

const drop_personality_data = `DROP TABLE IF EXISTS personality_data`

const drop_database = `DROP DATABASE films`;
const create_database = `CREATE DATABASE films`; 
const select_database = `USE films`;

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

const create_userid_movie_personality = `CREATE TABLE personality_user(PRIMARY KEY(userid)) AS
(SELECT userid,agreeableness, conscientiousness, emotional_stability, extraversion, openness, assigned_condition, assigned_metric, is_personalized, enjoy_watching FROM films.personality_data);
`;

const create_userid_movie_predicted = `
CREATE TABLE personality_predictions_movies(PRIMARY KEY(userid, all_movies))
(SELECT *
FROM (
    SELECT userid, movie_1 as all_movies, predicted_rating_1 as all_predictions FROM personality_data p1
    UNION ALL SELECT userid, movie_2 as all_movies, predicted_rating_2 as all_predictions FROM personality_data p2
    UNION ALL SELECT userid, movie_3 as all_movies, predicted_rating_3 as all_predictions FROM personality_data p3
    UNION ALL SELECT userid, movie_4 as all_movies, predicted_rating_4 as all_predictions FROM personality_data p4
    UNION ALL SELECT userid, movie_5 as all_movies, predicted_rating_5 as all_predictions FROM personality_data p5
    UNION ALL SELECT userid, movie_6 as all_movies, predicted_rating_6 as all_predictions FROM personality_data p6
    UNION ALL SELECT userid, movie_7 as all_movies, predicted_rating_7 as all_predictions FROM personality_data p7
    UNION ALL SELECT userid, movie_8 as all_movies, predicted_rating_8 as all_predictions FROM personality_data p8
    UNION ALL SELECT userid, movie_9 as all_movies, predicted_rating_9 as all_predictions FROM personality_data p9
    UNION ALL SELECT userid, movie_10 as all_movies, predicted_rating_10 as all_predictions FROM personality_data p10
    UNION ALL SELECT userid, movie_11 as all_movies, predicted_rating_11 as all_predictions FROM personality_data p11
    UNION ALL SELECT userid, movie_12 as all_movies, predicted_rating_12 as all_predictions FROM personality_data p12
) as every_movie_and_prediction);
`;

const search =`
SELECT links.imdbId FROM links where links.movieId IN (
  SELECT movies_titles.movieId FROM movies_titles WHERE movies_titles.title LIKE "%`

const baseOne=`
SELECT lk.imdbId 
FROM movie_years MY, links lk, movies_titles MT `

const baseOneWithGenreTable =`, movies_genres_sep G `

const baseOneWithRatingTable=`, films.ratings R `

const baseTwo=`WHERE MY.movieId = lk.movieId and MY.movieID = G.movieId and MY.movieId = MT.movieId and G.genre = ?
`
const baseTwoNoGenre=`WHERE MY.movieId = lk.movieId and MY.movieId = MT.movieId
`
const baseAlpha=`
ORDER BY MT.title
`
const baseYear=`
and MY.year!="" 
ORDER BY year
`
const userFilterYear = `
and MY.year > ? and MY.year < ? and MY.year!="" 
ORDER BY year
`
const basePopularity=`
and MT.movieID = R.movieID
GROUP BY lk.imdbId
ORDER BY count(R.movieId)
`

const baseRating=`
and MY.movieId = R.movieId
GROUP BY MY.movieId
ORDER BY AVG(R.rating) 
`
const desc=` DESC`

const create_movies_years = ` 
CREATE TABLE movie_years(PRIMARY KEY(movieId)) AS
SELECT movieId, REPLACE(RIGHT(title, LOCATE('(',REVERSE(title))-1),')','') AS year FROM films.movies M; 
`; 

// //substitute the Fair Game for %s
const case_one = `
SELECT MT.movieID, AVG(R.rating) as average_rating 
FROM films.movies_titles MT, films.ratings R 
WHERE MT.title = ? and MT.movieID = R.movieId
GROUP BY MT.movieID;
`;

//rate movies by average popularity
const case_two = `
SELECT lk.imdbId, AVG(R.rating) as average_rating
FROM films.movies_titles MT, films.ratings R, links lk 
WHERE MT.movieID = R.movieID AND MT.movieID = lk.movieId
GROUP BY lk.imdbId
ORDER BY AVG(R.rating) DESC; 
`;

const case_two_part_one = `
SELECT AVG(R.rating) as average_rating, SUM(R.rating) as aggregate_Rating, variance(R.rating) as variance_Rating
FROM films.movies_titles MT, films.ratings R, links lk 
WHERE MT.movieID = R.movieID and MT.movieID = lk.movieId and lk.tmdbId = ?;
`;

const case_two_part_two = `
SELECT R.rating, count(R.rating) as noOfRatings
FROM films.movies_titles MT, films.ratings R, links lk 
WHERE MT.movieID = R.movieID and MT.movieID = lk.movieId and lk.tmdbId = ?
GROUP BY R.rating
ORDER BY R.rating; 
`;

// polarity - genres descending - VR
const case_three_part_one = `
SELECT MG.genre, variance(R.rating) as Polarity, count(R.movieId) as number_of_reviewers
FROM films.movies_genres_sep MG, films.ratings R 
WHERE MG.movieId = R.movieId 
GROUP BY MG.genre 
ORDER BY Polarity DESC; 
`;

// popularity - genre descending - number_of_reviewers
const case_three_part_two = `
SELECT MG.genre, count(R.movieId) as number_of_reviewers, AVG(R.rating) as Popularity
FROM films.movies_genres_sep MG, films.ratings R 
WHERE MG.movieId = R.movieId 
GROUP BY MG.genre 
ORDER BY number_of_reviewers DESC; 
`;

//final
const case_four = `
SELECT SUM(top_20.RATING) * (user_count.all_users / COUNT(top_20.userId)) as predicted_rating, user_count.real_rating, AVG(top_20.RATING) as p_rating, user_count.all_users as total_viewers,
 COUNT(top_20.RATING) as subset_viewers, ABS(SUM(top_20.RATING) * (user_count.all_users / COUNT(top_20.userId))-user_count.real_rating)/user_count.real_rating as Accuracy
FROM (SELECT COUNT(R.userId) as all_users, SUM(R.rating) as real_rating 
FROM films.ratings R, films.movies_titles MT, films.links lk   
WHERE R.movieId = MT.movieId AND MT.movieId=lk.movieId AND lk.tmdbId= ?) as user_count, (SELECT X.userid, X.RATING  
FROM    (  
    SELECT R.userId as userid, @counter := @counter +1 AS counter, R.rating as RATING  
    FROM (select @counter:=0) AS var, (SELECT R.userId, R.rating FROM films.ratings R, films.movies_titles MT, films.links lk WHERE R.movieId = MT.movieId AND MT.movieId=lk.movieId AND lk.tmdbId= ?) R 
    ORDER BY R.userid DESC     
) AS X  
where (20/100 * @counter) >= counter) top_20
GROUP BY user_count.all_users;
`;

/*
const case_four = `
SELECT SUM(R.rating) * (user_count.all_users / COUNT(R.userId)) as predicted_rating, user_count.real_rating, AVG(R.rating) as p_rating, user_count.all_users as total_viewers, COUNT(R.userId) as subset_viewers
FROM films.ratings R, films.movies_titles MT, films.links lk, (SELECT COUNT(R.userId) as all_users, SUM(R.rating) as real_rating 
FROM films.ratings R, films.movies_titles MT, films.links lk   
WHERE R.movieId = MT.movieId AND MT.movieId=lk.movieId AND lk.tmdbId= ?) as user_count  
WHERE R.movieId = MT.movieId AND MT.movieId = lk.movieId AND REPLACE(RIGHT(title, LOCATE('(',REVERSE(title))-1),')','') = YEAR(FROM_UNIXTIME(R.timestamp)) AND lk.tmdbId= ? 
GROUP BY user_count.all_users;  
`;
*/

const case_five = `SELECT top_70.openness as predicted_openness, top_30.openness as actual_openness, ABS(top_70.openness - top_30.openness) as difference_openness, top_70.agreeableness as predicted_agreeableness, top_30.agreeableness as actual_agreeableness, ABS(top_70.agreeableness - top_30.agreeableness) as difference_agreeableness, top_70.emotional_stability as predicted_emotional_stability, top_30.emotional_stability as actual_emotional_stability, ABS(top_70.emotional_stability - top_30.emotional_stability) as difference_emotional_stability, top_70.conscientiousness as predicted_conscientiousness, top_30.conscientiousness as actual_conscientiousness, ABS(top_70.conscientiousness - top_30.conscientiousness) as difference_conscientiousness, top_70.extraversion as predicted_extraversion, top_30.extraversion as actual_extraversion, ABS(top_70.extraversion - top_30.extraversion) as difference_extraversion,
ABS(top_70.openness - top_30.openness)/top_30.openness as openAcc, 
ABS(top_70.agreeableness - top_30.agreeableness)/top_30.agreeableness as agreeAcc, 
ABS(top_70.emotional_stability - top_30.emotional_stability)/top_30.emotional_stability as emoAcc,
ABS(top_70.conscientiousness - top_30.conscientiousness)/top_30.conscientiousness as conAcc,
ABS(top_70.extraversion - top_30.extraversion)/top_30.extraversion as extrAcc,
(ABS(top_70.openness - top_30.openness)/top_30.openness + ABS(top_70.agreeableness - top_30.agreeableness)/top_30.agreeableness + (top_30.emotional_stability - top_30.emotional_stability)/top_30.emotional_stability + ABS(top_70.conscientiousness - top_30.conscientiousness)/top_30.conscientiousness + ABS(top_70.extraversion - top_30.extraversion)/top_30.extraversion)/5 as totalAcc
FROM (SELECT AVG(P.openness) as openness, AVG(P.agreeableness) As agreeableness, AVG(P.emotional_stability) AS emotional_stability, AVG(P.conscientiousness) AS conscientiousness, AVG(P.extraversion) AS extraversion  
FROM films.personality_user P JOIN films.ratings_personality R on P.userid = R.userId  
WHERE P.userId IN (SELECT X.userid    
FROM (SELECT R.userId as userid, @counter := @counter +1 AS counter    
    FROM (select @counter:=0) AS var, (SELECT DISTINCT R.userId FROM films.ratings_personality R, films.movies_titles M, films.links lk WHERE lk.tmdbId = ? AND lk.movieId = M.movieId AND R.movie_id = M.movieId AND R.rating >= 4) R  
    ORDER BY R.userid DESC) AS X    
where (70/100 * @counter) >= counter)) top_70, (SELECT AVG(P.openness) as openness, AVG(P.agreeableness) As agreeableness, AVG(P.emotional_stability) AS emotional_stability, AVG(P.conscientiousness) AS conscientiousness, AVG(P.extraversion) AS extraversion  
FROM films.personality_user P JOIN films.ratings_personality R on P.userid = R.userId  
WHERE P.userId IN (SELECT X.userid    
FROM (SELECT R.userId as userid, @counter := @counter +1 AS counter    
    FROM (select @counter:=0) AS var, (SELECT DISTINCT R.userId FROM films.ratings_personality R, films.movies_titles M ,films.links lk WHERE lk.tmdbId = ? AND lk.movieId = M.movieId AND R.movie_id = M.movieId AND R.rating >= 4) R  
    ORDER BY R.userid DESC) AS X    
where (70/100 * @counter) <= counter)) top_30;`;



// const case_six = `
// SELECT AVG(P.openness) as Openness, AVG(P.agreeableness) As Agreeableness, AVG(P.emotional_stability) AS Emotional_stability, AVG(P.conscientiousness) AS Conscientiousness, AVG(P.extraversion) AS Extraversion FROM films.personality_data P 
// WHERE P.movie_1 in (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
// OR P.movie_2 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
// OR P.movie_3 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
// OR P.movie_4 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
// OR P.movie_5 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?)) 
// OR P.movie_6 IN (SELECT T.movieId FROM tags T WHERE T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.title=?));
// `;

// const case_six = `SELECT ABS(people_tag.openness - people_like.openness) AS diff_openness, ABS(people_tag.agreeableness - people_like. agreeableness) AS diff_agreeableness, ABS(people_tag.emotional_stability - people_like.emotional_stability) AS diff_emotional_stability, ABS(people_tag.conscientiousness - people_like.conscientiousness) AS diff_conscientiousness, ABS(people_tag.extraversion - people_like.extraversion) AS diff_extraversion 

// FROM (SELECT AVG(P.openness) as openness, AVG(P.agreeableness) As agreeableness, AVG(P.emotional_stability) AS emotional_stability, AVG(P.conscientiousness) AS conscientiousness, AVG(P.extraversion) AS extraversion 

// FROM films.personality_data P  

// WHERE P.movie_1 in (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?))  

// OR P.movie_2 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?))  

// OR P.movie_3 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?))  

// OR P.movie_4 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?))  

// OR P.movie_5 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?))  

// OR P.movie_6 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?)) 

// OR P.movie_7 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?)) 

// OR P.movie_8 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?)) 

// OR P.movie_9 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?)) 

// OR P.movie_10 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?)) 

// OR P.movie_11 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?)) 

// OR P.movie_12 IN (SELECT T.movieId FROM tags T WHERE T.movieId != ? AND T.tag IN (SELECT tag FROM films.tags T, movies M  WHERE T.movieId = M.movieId AND M.movieId = ?))) people_tag, (SELECT AVG(P.openness) as openness, AVG(P.agreeableness) As agreeableness, AVG(P.emotional_stability) AS emotional_stability, AVG(P.conscientiousness) AS conscientiousness, AVG(P.extraversion) AS extraversion 

// FROM films.personality_data P,  (SELECT RP.userid as userId FROM films.ratings_personality RP  WHERE RP.movie_id = ? and RP.rating >=4) user_like 

// WHERE user_like.userId = P.userid) people_like; `;

const case_six = `
SELECT top_70.openness as predicted_openness, top_30.openness as actual_openness, ABS(top_70.openness - top_30.openness) as difference_openness, top_70.agreeableness as predicted_agreeableness, top_30.agreeableness as actual_agreeableness, ABS(top_70.agreeableness - top_30.agreeableness) as difference_agreeableness, top_70.emotional_stability as predicted_emotional_stability, top_30.emotional_stability as actual_emotional_stability, ABS(top_70.emotional_stability - top_30.emotional_stability) as difference_emotional_stability, top_70.conscientiousness as predicted_conscientiousness, top_30.conscientiousness as actual_conscientiousness, ABS(top_70.conscientiousness - top_30.conscientiousness) as difference_conscientiousness, top_70.extraversion as predicted_extraversion, top_30.extraversion as actual_extraversion, ABS(top_70.extraversion - top_30.extraversion) as difference_extraversion,
ABS(top_70.openness - top_30.openness)/top_30.openness as openAcc, 
ABS(top_70.agreeableness - top_30.agreeableness)/top_30.agreeableness as agreeAcc, 
ABS(top_70.emotional_stability - top_30.emotional_stability)/top_30.emotional_stability as emoAcc,
ABS(top_70.conscientiousness - top_30.conscientiousness)/top_30.conscientiousness as conAcc,
ABS(top_70.extraversion - top_30.extraversion)/top_30.extraversion as extrAcc,
(ABS(top_70.openness - top_30.openness)/top_30.openness + ABS(top_70.agreeableness - top_30.agreeableness)/top_30.agreeableness + (top_30.emotional_stability - top_30.emotional_stability)/top_30.emotional_stability + ABS(top_70.conscientiousness - top_30.conscientiousness)/top_30.conscientiousness + ABS(top_70.extraversion - top_30.extraversion)/top_30.extraversion)/5 as totalAcc
FROM (SELECT AVG(P.openness) as openness, AVG(P.agreeableness) As agreeableness, AVG(P.emotional_stability) AS emotional_stability, AVG(P.conscientiousness) AS conscientiousness, AVG(P.extraversion) AS extraversion  
FROM films.personality_user P JOIN films.ratings_personality R on P.userid = R.userId  
WHERE P.userId IN (SELECT X.userid    
FROM (SELECT R.userId as userid, @counter := @counter +1 AS counter    
    FROM (select @counter:=0) AS var, (SELECT DISTINCT R.userId FROM films.ratings_personality R, films.movies_titles M, films.links lk WHERE lk.tmdbId = ? AND lk.movieId = M.movieId AND R.movie_id = M.movieId AND R.rating >= 4) R  
    ORDER BY R.userid DESC) AS X    
where (70/100 * @counter) >= counter)) top_70, (SELECT AVG(P.openness) as openness, AVG(P.agreeableness) As agreeableness, AVG(P.emotional_stability) AS emotional_stability, AVG(P.conscientiousness) AS conscientiousness, AVG(P.extraversion) AS extraversion  
FROM films.personality_user P JOIN films.ratings_personality R on P.userid = R.userId  
WHERE P.userId IN (SELECT X.userid    
FROM (SELECT R.userId as userid, @counter := @counter +1 AS counter    
    FROM (select @counter:=0) AS var, (SELECT DISTINCT R.userId FROM films.ratings_personality R, films.movies_titles M ,films.links lk WHERE lk.tmdbId = ? AND lk.movieId = M.movieId AND R.movie_id = M.movieId AND R.rating >= 4) R  
    ORDER BY R.userid DESC) AS X    
where (70/100 * @counter) <= counter)) top_30;`;

const getGenres = `
SELECT DISTINCT(genre) FROM films.movies_genres_sep
`
const getFilmsinGenre = `
SELECT links.imdbId FROM links where links.movieId IN (SELECT movieID FROM films.movies_genres_sep WHERE genre=?);
`

const getTopRatedMovies = `
SELECT lk.imdbId, AVG(R.rating) as average_rating
FROM films.movies_titles MT, films.ratings R, links lk 
WHERE MT.movieID = R.movieID AND MT.movieID = lk.movieId
GROUP BY lk.imdbId
ORDER BY AVG(R.rating) DESC; 
`;

const getPopulardMovies = `
SELECT lk.imdbId, count(R.movieId) as number_of_reviewers
FROM films.movies_titles MT, films.ratings R, links lk 
WHERE MT.movieID = R.movieID AND MT.movieID = lk.movieId
GROUP BY lk.imdbId
ORDER BY number_of_reviewers DESC; 
`;

const getPolarisingMovies = `
SELECT lk.imdbId, variance(R.rating) as Polarity
FROM films.movies_titles MT, films.ratings R, links lk 
WHERE MT.movieID = R.movieID AND MT.movieID = lk.movieId
GROUP BY lk.imdbId
ORDER BY Polarity DESC; 
`;

module.exports = {
    create_list, 
    drop_all,
    filenames, 
    csv_queres, 
    create_movies_years, 
    baseAlpha, 
    baseRating, 
    baseYear, 
    baseOne,
    baseTwo,
    baseTwoNoGenre,
    baseOneWithGenreTable,
    baseOneWithRatingTable,
    basePopularity,
    desc,
    userFilterYear,
    case_one, 
    case_two, 
    case_three_part_one, 
    case_three_part_two, 
    case_four,
    case_five,
    case_six, 
    create_movies_genre, 
    create_movies_title, 
    create_movies_genres_sep, 
    search, 
    case_two_part_one, 
    case_two_part_two, 
    getGenres, 
    getFilmsinGenre, 
    getTopRatedMovies, 
    getPopulardMovies, 
    getPolarisingMovies,
    create_userid_movie_personality,
    create_userid_movie_predicted,
    drop_movie_tables,
    drop_personality_data,
    drop_database,
    create_database,
    select_database
}