import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';

import MovieList from '../../components/movie-list/MovieList';
import axios from 'axios';

/*

1. Browsing visual lists of films in the database, allowing lists to be selected and sorted by user specified parameters.
    - Not applicable to this


2. Searching for a known film to obtain a report on the viewer reaction to it (i.e., an interpreted report with aggregated
viewer ratings, etc.).
    - Aggregated view ratings
    - No of users that give it a 5
    - Variance of the ratings
    - Graph of user ratings over time

3. Reporting which are the most popular kinds of movies and which are the most polarising kinds of movie (extreme
difference in ratings).
    - Not applicable to this
    - Most poopular an 

4. Predicting how a film will be rated after its release from the reactions of a small preview audience, i.e., taking a sub-set of
the viewers for a particular movie in the data set and treating them as though they were people at a preview, is it possible
to predict the aggregate ratings of that film by all viewers from just that sub-set?
    - Predicted rating

5. Predicting the personality traits of viewers of a film who will give it a high rating. Using the personality/ratings dataset from
GroupLens, can the ratings/personality data of a sub-set of viewers of a particular film be used to predict the ratings of that
film by the complete data set in terms of how different personality types will like the film?
    - Predicted personality traits that would like the movie

6. Predicting which personality types will like a film given the tag data for that film. By joining the tag datasets and
personality/ratings datasets, is it possible to predict which kinds of personality trait will be associated most with liking a
film that has particular kinds of tags (e.g., conscientiousness is associated with complex plots or whatever).
    -  Predicting personality types

*/

const Detail = () => {

    const { category, id } = useParams();

    const [item, setItem] = useState(null);
    const [dbItems, setItems] = useState(null);

    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params:{}});
            setItem(response);

            function functionOne(_callback){
                // do some asynchronus work 
                _callback();
            }

            var responseFromOurDb = [];
            
            function functionTwo(){
                // do some asynchronus work 
                //responseFromOurDb = tmdbApi.getMovieInfo(id, {params:id});

                responseFromOurDb = axios.get("http://localhost:3001/secondQuery?query="+id, {params:id}).then((response) => {
                    //RESPONSE IS THE IDS
                    console.log("Hey")
                    console.log(response);
                    setItems(response.data);
                });


                functionOne(()=>{

                });
            }
            
            functionTwo();

            window.scrollTo(0,0);
        }
        getDetail();
    }, [category, id]);

    return (
        <>
            {
                dbItems && item && (
                    <>
                        <div className="wrapper" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})`}}>
                        <script>
                            function log_console() {
                                console.log("GeeksforGeeks is a portal for geeks.")
                            }
                            function log_console() {
                                console.log(dbItems)
                            }
                            function log_console() {
                                console.log(item)
                            }
                            function log_console() {
                                console.log(dbItems[0])
                            }
                        </script>
                             
                            
                        {/* <div className="banner" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})`}}></div> */}
                        <div className="mb-3 movie-content container">
                            <div className="movie-content__poster">
                                <div className="movie-content__poster__img" style={{backgroundImage: `url(${apiConfig.originalImage(item.poster_path || item.backdrop_path)})`}}></div>
                            </div>
                            <div className="movie-content__info">
                                <h1 className="title">
                                    {item.title || item.name}
                                </h1>
                                <div className="genres">
                                    {
                                        item.genres && item.genres.slice(0, 5).map((genre, i) => (
                                            <span key={i} className="genres__item">{genre.name}</span>
                                        ))
                                    }
                                </div>
                                <div className='rating-directors'>
                                <div>
                                    <h3 > RATING</h3>
                                     <div className="score" style={{marginTop:10, marginLeft:15}}>{dbItems[0][0].average_rating || 0}</div>
                                </div>
                                

                                <div className='director'>
                                        <h3>DIRECTOR{item.directors}</h3>
                                        {
                                            item.directors && item.directors.slice(0, 5).map((director, i) => (
                                                
                                                <p >{director.name}</p>
                                            ))
                                        }
                                        {/* {item.directors.map(director => ( <p key={director.credit_id}>{director.name}</p> ))} */}
                                 </div>

                                 
                                 </div>

                                 <div className="detailedRatings">
                                    <h5>No. of users with rating 1: {dbItems[1][4].rating || 0}</h5>
                                    <h5>No. of users with rating 2: {dbItems[1][3].rating || 0}</h5>
                                    <h5>No. of users with rating 3: {dbItems[1][2].rating || 0}</h5>
                                    <h5>No. of users with rating 4: {dbItems[1][1].rating || 0}</h5>
                                    <h5>No. of users with rating 5: {dbItems[1][0].rating || 0}</h5>
                                    <h5>Total no. of users: {dbItems[0][0].aggregate_Rating || 0}</h5>              
                                    <h5>Variance of the ratings: {dbItems[0][0].variance_Rating || 0}</h5>
                                    <br />
                                    <h5>Predicted rating: </h5>
                                    <br />
                                    <h5>Predicted personality traits: </h5>
                                    <br />
                                    <h5>Predicted personality types: </h5>


                                </div>

                                <h3 > PLOT</h3>
                                <div className="overview" >{item.overview}</div>
                                
                                <div className="cast">
                                    <div className="section__header">
                                        <h3>CASTS</h3>
                                    </div>
                                    <CastList id={item.id}/>
                                </div>
                            </div>
                        </div>
                        </div>
                        <p style={{marginTop:20}}></p>
                        <div className="container">
                            <div className="section mb-3">
                            
                            <h2>TRAILER</h2>
                                <VideoList id={item.id}/>
                            </div>
                            <div className="section mb-3">
                                <div className="section__header mb-2">
                                    <h2>SIMILAR</h2>
                                </div>
                                <MovieList category={category} type="similar" id={item.id}/>
                            </div>
                        </div>
                        
                    </>
                )
            }
        </>
    );
}

export default Detail;
