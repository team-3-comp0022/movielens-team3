import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './movie-list.scss';
import { SwiperSlide, Swiper } from 'swiper/react';
import tmdbApi, { category, display } from '../../api/tmdbApi';
import MovieCard from '../movie-card/MovieCard';
import axios from "axios";

const MovieList = props => {

    var [items, setItems] = useState([]);

    useEffect(() => {
        const getList = async () => {
            let response = null;
            var result = [];
            var getIndexesFromOurDatabase = [];
            const params = {};

            if (props.type !== 'similar') {
                switch(props.category) {
                    case category.movie: // getting all movies 
                        getIndexesFromOurDatabase = await axios.get('http://localhost:3001/findMovieIds')
                        var numberOfMovies = getIndexesFromOurDatabase.data.length;
                        for (var i = 0; i < 30; i++) // obtain all the movies we want to load max on the page
                            result.push(getIndexesFromOurDatabase.data[i]); // result will have the imdbIds to be appended to the url sent to the api
                        
                        getIndexesFromOurDatabase = tmdbApi.getMoviesFromOurDatabase(result, {params}); // getIndexesFromOurDatabase will contained the urls in a list that can be accessed directly to retrieve the movies
                        result = []
                        for (var i = 0; i < 30; i++) 
                            getIndexesFromOurDatabase[i].then(value => { 
                                result.push(value.movie_results[0]);            
                            });
                                             
                        response = {page:2, results: result, total_pages: 4, total_results: numberOfMovies}; 
                          
                        setItems(response.results); 
                        break;

                    case category.polarising:
                        // getIndexesFromOurDatabase = await axios.get('http://localhost:3001/thirdQuery')
                        // console.log("get polarising", getIndexesFromOurDatabase);
                        break;

                    case category.popular:
                        result = [];
                        var getIndexes = [];
                        var getPopular = await axios.get('http://localhost:3001/getPopularMovies');
                        
                        
                        var numberOfPopularMovies = getPopular.data.length;
                        for (var i = 0; i < 50; i++) // obtain all the movies we want to load max on the page
                            result.push(getPopular.data[i]); // result will have the imdbIds to be appended to the url sent to the api
                            
                        getIndexesFromOurDatabase = tmdbApi.getMoviesFromOurDatabase(result, {params}); // getIndexesFromOurDatabase will contained the urls in a list that can be accessed directly to retrieve the movies
                        result = []
                        for (var i = 0; i < 50; i++) 
                            getIndexesFromOurDatabase[i].then(value => { 
                                result.push(value.movie_results[0]);            
                            });
                                             
                        response = {page:1, results: result, total_pages: 482, total_results: numberOfPopularMovies}; 
                       
                        setItems(response.results); 
                        break;

                    case category.pickGenre:
                            let responseSearch = null;
                            var getListOfFilmsInGenre = axios.get('http://localhost:3001/getFilmInGenre?query=' + props.type);
                            // console.log("get films in genre", getListOfFilmsInGenre);

                            result = [];
                            var getIndexes = [];
                            getListOfFilmsInGenre.then(value => {  
                                    for(var i=0; i< 10; i++)
                                        result.splice(i, 0, value.data[i]);
                                    //console.log("params", result);
                                    
                                    getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params});
                                    //console.log("new", getIndexes);

                                    var result2 = []
                                    for (var i = 0; i < 10; i++) 
                                        getIndexes[i].then(value => { 
                                            result2.push(value.movie_results[0]); 
                                        });
                                                        
                                    responseSearch = {page:1, results: result2, total_pages: 4, total_results: value.data.length};                   
                                    setItems(responseSearch.results); 
                                });
                            break;
                  
                }
            } else {
                response = await tmdbApi.similar(props.category, props.id);
                setItems(response.results); 
            }
        }
        getList();
    }, []);

    return (
        <div className="movie-list">
            <Swiper
                grabCursor={true}
                spaceBetween={10}
                slidesPerView={'auto'}
            >
                {
                     <script>
                     function log_console() {
                    items.map((item, i) => (
                       
                        <SwiperSlide key={i}>
                            <MovieCard item={item} />
                        </SwiperSlide>
                    ))
                    }
                          
                    </script>

                   

                }
            </Swiper>
            
        </div>

        
    );
}

MovieList.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
}

export default MovieList;
