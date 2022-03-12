import React, { useEffect, useState }  from 'react';
import { Link } from 'react-router-dom';
import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import ProgressBar from "@ramonak/react-progress-bar";
import { SwiperSlide, Swiper } from 'swiper/react'
import tmdbApi, { category, movieType, tvType } from '../api/tmdbApi';
import { useParams } from 'react-router';
import axios from 'axios';
import '../components/movie-grid/movie-grid.scss';
import '../components/movie-card/movie-card.scss';

const Home = () => {
    const [genres, setGenres] = useState([])
    const [polarisingKinds, setPolarisingKinds] = useState([])
    const [polarisingRates, setPolarisingRates] = useState([])
    const [polarising, setPolarising] = useState({})
    var genresPolarising = []
    var VRsPolarising = []

 useEffect(() => {
        const getDetail = async () => {
            var listOfGenres = await axios.get('http://localhost:3001/getGenre');
            listOfGenres = listOfGenres.data.slice(0, 19); // the 20th is "no genre available" so exclude it
            for (var i = 0; i < 19; i++) 
            listOfGenres[i] = listOfGenres[i].genre; 
            setGenres(listOfGenres);   

            var getPolarising = await axios.get('http://localhost:3001/thirdQuery')
            for (var i = 0; i < getPolarising.data.length ; i++) 
              if( getPolarising.data[i].genre != "(no genres listed)"){
                  genresPolarising.push( getPolarising.data[i].genre); 
                  //console.log("get kind", genresPolarising[i]);
                  VRsPolarising.push( getPolarising.data[i].VR.toFixed(5)); 
            }

           setPolarising({genres: genresPolarising, VR: VRsPolarising})
           setPolarisingKinds(genresPolarising);  
           setPolarisingRates(VRsPolarising);

        }
        getDetail();
    }, []);

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
                    <MovieList category={category.popular} type={movieType.top_rated}/>
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Most Popular Kinds of Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    
                </div>

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Most Polarising Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.polarising} type={movieType.top_rated}/>
                </div>
                
                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Most Polarising Kinds of Movies</h2>
                        </div>
                       {
                      
                          polarisingKinds.map((item, i) => (
                            <div className="section" style={{marginTop:2, width:'80%'}}>
                               
                                <div class="grid">
                                    <div class="columnn" style={{paddignRight:-30, marginRight:-150}}> 
                                       <h6>  { polarisingRates[i]}</h6>
                                     </div>
                                     <div class="columnn" style={{alignContent:"left", marginLeft:-100}}> 
                                         <ProgressBar  animateOnRender={true} completed={polarisingRates[i]*100/polarisingRates[0]} maxCompleted={100} bgColor="#353638" customLabel={item} barContainerClassName="container" /> 
                                     </div>
                            </div>
                            </div>
                                    //  <h2> genre: {item} {polarisingRates[i]}</h2>
                                  
                        ))
                       }
                      
                   
                    
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
                   <MovieList category={category.pickGenre} type={item}/>
               </div>
               ))
                   
               }
             
   </div>
            
        </>
    );
}

export default Home;
