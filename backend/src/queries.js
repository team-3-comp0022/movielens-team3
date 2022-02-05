
//substitute the Fair Game for %s
const case_one = `
SELECT MT.movieID, AVG(R.rating) as average_rating 
FROM films.movies_titles MT, films.ratings R 
WHERE MT.title = "Fair Game (1995)" and MT.movieID = R.movieId;
`;

//rate movies by average popularity
const case_two = `
SELECT MT.title, AVG(R.rating) 
FROM films.movies_titles MT, films.ratings R 
WHERE MT.movieID = R.movieID 
GROUP BY MT.title 
ORDER BY AVG(R.rating) DESC; 
`;


//polarity
const case_three = `
CREATE TABLE movies_genres_sep AS 
(select 
films.movies_genres.movieId, 
SUBSTRING_INDEX(SUBSTRING_INDEX(films.movies_genres.genres, '|', numbers.n), '|', -1) name 
from 
(select 1 n union all 
select 2 union all select 3 union all 
select 4 union all select 5) numbers INNER JOIN films.movies_genres 
on CHAR_LENGTH(films.movies_genres.genres) 
-CHAR_LENGTH(REPLACE(films.movies_genres.genres, '|', ''))>=numbers.n-1 
order by 
films.movies_genres.movieId, n);
`;

//predict how a film
const case_four = `
SELECT hello.title, AVG(hello.rating), averages.avg_rating, ABS(averages.avg_rating - hello.rating) as difference 

FROM ( 

SELECT R.userId, R.movieId, MT.title, SUBSTRING_INDEX(SUBSTRING_INDEX(MT.title, '(', -1), ')', 1) as year, FROM_UNIXTIME(R.timestamp) as rating_time_stamp, R.rating 

FROM films.ratings R, films.movies_titles MT 

WHERE R.movieId = MT.movieId  

AND SUBSTRING_INDEX(SUBSTRING_INDEX(MT.title, '(', -1), ')', 1) = YEAR(FROM_UNIXTIME(R.timestamp)) 

) AS hello, (SELECT MT.title, AVG(R.rating) as avg_rating, MT.movieId 

FROM films.movies_titles MT, films.ratings R  

WHERE MT.movieId = R.movieId 

GROUP BY MT.title  

ORDER BY AVG(R.rating) DESC) AS averages 

WHERE hello.movieId = averages.movieId 

GROUP BY hello.movieId ;
`;