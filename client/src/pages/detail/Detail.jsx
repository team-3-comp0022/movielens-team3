import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';

import MovieList from '../../components/movie-list/MovieList';

const Detail = () => {

    const { category, id } = useParams();

    const [item, setItem] = useState(null);

    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params:{}});
            setItem(response);
            window.scrollTo(0,0);
        }
        getDetail();
    }, [category, id]);

    return (
        <>
            {
                item && (
                    <>
                        <div className="wrapper" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})`}}>
                            
                             
                            
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
                                     <div className="score" style={{marginTop:10, marginLeft:15}}>{item.vote_average}</div>
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
