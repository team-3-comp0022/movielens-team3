import React, { useEffect, useState }  from 'react';
import { Link } from 'react-router-dom';
import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import tmdbApi, { category, movieType, tvType } from '../api/tmdbApi';
import { useParams } from 'react-router';
import axios from 'axios';

const Home = () => {
    const { listOfGenres } = useParams();
    const [genres, setGenres] = useState([])

 useEffect(() => {
        const getDetail = async () => {
            var listOfGenres = await axios.get('http://localhost:3001/getGenre');
            listOfGenres = listOfGenres.data.slice(0, 19); // the 20th is "no genre available" so exclude it
            for (var i = 0; i < 19; i++) 
            listOfGenres[i] = listOfGenres[i].genre; 
            console.log("genres names", listOfGenres);
            
            setGenres(listOfGenres);   
        }
        getDetail();
    }, [listOfGenres]);

    return (
        <>
         
           
              <HeroSlide/>
             
              <div className="container">
                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>All Available Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.movie} type={movieType.top_rated}/>
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Most Popular Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.movie} type={movieType.top_rated}/>
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Most Polarising Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.movie} type={movieType.top_rated}/>
                </div>

               
        
               { 
                 genres.map((item, i) => (
                   <div className="section mb-3">
                   <div className="section__header mb-2">
                       <h2>All {item} Movies</h2>
                       <Link to="/movie">
                           <OutlineButton className="small">View more</OutlineButton>
                       </Link>
                   </div>
                   <MovieList category={category.popular} type={item}/>
               </div>
               ))
                   
               }
             
   </div>
            
        </>
    );
}

export default Home;
