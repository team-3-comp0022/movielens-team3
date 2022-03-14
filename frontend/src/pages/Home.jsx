import React, { useEffect, useState }  from 'react';
import { Link } from 'react-router-dom';
import { OutlineButton } from '../components/button/Button';
import HeroSlide from '../components/hero-slide/HeroSlide';
import MovieList from '../components/movie-list/MovieList';
import ProgressBar from "@ramonak/react-progress-bar";
import tmdbApi, { category, movieType } from '../api/tmdbApi';
import axios from 'axios';
import '../components/movie-grid/movie-grid.scss';
import '../components/movie-card/movie-card.scss';
import '../components/button/button.scss';
import { SwiperSlide, Swiper } from 'swiper/react';
import MovieCard from '../components/movie-card/MovieCard';

const Home = () => {
    const [genres, setGenres] = useState([])
    const [polarisingKinds, setPolarisingKinds] = useState([])
    const [polarisingRates, setPolarisingRates] = useState([])
    const [popularityKinds, setPopularityKinds] = useState([])
    const [popularityRates, setPopularityRates] = useState([])
    var genresPolarising = []
    var VRsPolarising = []
    var genresPopularity = []
    var VRsPopularity = []
    var [items, setItems] = useState([]);

 useEffect(() => {
        const getDetail = async () => {
            var listOfGenres = await axios.get('http://localhost:3001/getGenre');
            listOfGenres = listOfGenres.data.slice(0, 19); // the 20th is "no genre available" so exclude it
            for (var i = 0; i < 19; i++) 
            listOfGenres[i] = listOfGenres[i].genre; 
            setGenres(listOfGenres);   

            var getPolarising = await axios.get('http://localhost:3001/thirdQueryPartOne')
            for (var i = 0; i < getPolarising.data.length ; i++) 
              if( getPolarising.data[i].genre != "(no genres listed)"){
                  genresPolarising.push( getPolarising.data[i].genre); 
                  VRsPolarising.push( getPolarising.data[i].Polarity.toFixed(5)); 
            }

           setPolarisingKinds(genresPolarising);  
           setPolarisingRates(VRsPolarising);


           var getPopularity = await axios.get('http://localhost:3001/thirdQueryPartTwo')
           for (var i = 0; i < getPopularity.data.length ; i++) 
             if( getPopularity.data[i].genre != "(no genres listed)"){
                 genresPopularity.push( getPopularity.data[i].genre); 
                 VRsPopularity.push( getPopularity.data[i].number_of_reviewers.toFixed(0)); 
           }

           setPopularityKinds(genresPopularity);  
           setPopularityRates(VRsPopularity);

       
           rowsRendering("all");

        }
        getDetail();
    }, []);

    const getDynamicallyByGenre = async ()=> {
        let response= null;
        var result = [];
        var getIndexes = [];
        const params ={};
        
        var getListOfFilmsInGenre = await axios.get('http://localhost:3001/getFilmInGenre?query=' + "Drama");
        

        var numberOfMovies = getListOfFilmsInGenre.data.length;
        for (var i = 0; i < 50; i++) // obtain all the movies we want to load max on the page
            result.push(getListOfFilmsInGenre.data[i]); 
            
        getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params}); 
                  var sp = [];
            for (var i = 0; i < 50; i++) {  
                getIndexes[i].then(value => {  
                    sp.splice(i, 0, value.movie_results[0]);
                    setItems([items, ...sp]);
                }); 
            }                  
        response = {page:1, results: sp, total_pages: 482, total_results: numberOfMovies}; 
    }

    function sorting(category_arg, type_arg, order_arg) {
        var result = [];
        var getIndexes = [];
        let response = null;
        var params = {
        category: category_arg, //["Drama",2010,2015],
        type: type_arg,
        order: order_arg
      }
       var getFilms = axios.get('http://localhost:3001/firstQuery?category=' + params.category + "&type=" + params.type + "&order=" + params.order);
       console.log("pnm", getFilms);        

        getFilms.then(value => {  
            
            for(var i=0; i< 50; i++)
                result.splice(i, 0, value.data[i]);
            
            const params2 = {};
            getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params2});
            console.log("params", getIndexes);
            var sp = [];
            for (var i = 0; i < 50; i++) {  
                getIndexes[i].then(value => {  
                    sp.splice(i, 0, value.movie_results[0]);
                    setItems([items, ...sp]);
                }); 
            }    
                                
            response = {page:1, results: sp, total_pages: 4, total_results: value.data.length};                   
        });
    }

    function rowsRendering(renderCase) {
        var result = [];
        var getIndexes = [];
        let response = null;
      if(renderCase == "all"){
        var getFilms =  axios.get('http://localhost:3001/findMovieIds');
      }
      console.log("pnm", getFilms);        

      getFilms.then(value => {  
            
            for(var i=0; i< 50; i++)
                result.splice(i, 0, value.data[i]);
            
            const params2 = {};
            getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params2});
            console.log("params", getIndexes);
            var sp = [];
            for (var i = 0; i < 50; i++) {  
                getIndexes[i].then(value => {  
                    sp.splice(i, 0, value.movie_results[0]);
                    setItems([items, ...sp]);
                }); 
            }    
                                
            response = {page:1, results: sp, total_pages: 4, total_results: value.data.length};                   
        });
    }

    return (
        <>
              <HeroSlide/>
             
              <div className="container">
                

                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2> All Available Movies </h2>
                        <div class="dropdown">
                                <button class="dropbtn">Sort list of movies
                                <i className="bx bx-caret-down"></i>
                                </button>
                                
                                <div class="dropdown-content">

                                    <a onClick={() => sorting("", "alphabetical", "asc")}> By Title Ascending (A-Z)</a>
                                    <a onClick={() => sorting("", "alphabetical", "desc")}>By Title Descending (Z-A)</a>
                                    <a onClick={() => sorting("", "rating", "asc")}>By Ratings Ascending</a>
                                    <a onClick={() => sorting("", "rating", "desc")}>By Ratings Descending</a>
                                    <a href="#">By Popularity Ascending</a>
                                    <a href="#">By Popularity Descending</a>
                                    <a href="#">By Release Date Ascending</a>
                                    <a href="#">By Release Date Descending</a>
                                </div>
                    </div>

                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <div className="movie-list">
                 
                            <Swiper
                                grabCursor={true}
                                spaceBetween={10}
                                slidesPerView={'auto'} >
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
                </div>


                <div className="section mb-3">
                    <div className="section__header mb-2">
                        <h2>Top Rated Movies</h2>
                        <Link to="/movie">
                            <OutlineButton className="small">View more</OutlineButton>
                        </Link>
                    </div>
                    <MovieList category={category.topRated} type={movieType.top_rated}/>
                    
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
                    {
                      
                      popularityKinds.map((item, i) => (
                        <div className="section" style={{marginTop:2, width:'80%'}}>
                           
                            <div class="grid">
                                <div class="columnn" style={{paddignRight:-30, marginRight:-150}}> 
                                   <h6>  { item}</h6>
                                 </div>
                                 <div class="columnn" style={{alignContent:"left", marginLeft:-100}}> 
                                     <ProgressBar  animateOnRender={true} completed={popularityRates[i]*100/popularityRates[0]} maxCompleted={100} bgColor="#353638" customLabel={popularityRates[i]} barContainerClassName="container" /> 
                                 </div>
                        </div>
                        </div>       
                    ))
                   }
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
                        ))
                       }
                </div>

                  {
                <div className="movie-grid__loadmore">
                {/* <OutlineButton className="small" onClick={getByGenre}>Load more movies</OutlineButton>
                <OutlineButton className="small" >Load more movies</OutlineButton> */}

                </div>
                    }
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