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
        genre: category_arg, //["Drama",2010,2015],
        type: type_arg,
        order: order_arg
      }
       var getFilms = axios.get('http://localhost:3001/firstQuerySorting?genre=' + params.genre + "&type=" + params.type + "&order=" + params.order);
        getFilms.then(value => {  
            
            for(var i=0; i< 50; i++)
                result.splice(i, 0, value.data[i]);
            
            const params2 = {};
            getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params2});
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

    function filtering(category_arg, type_arg) {
        var result = [];
        var getIndexes = [];
        let response = null;
        var params = {
        category: category_arg, //[2010, 2020]
        type: type_arg
        }

        console.log("second", category_arg);
        var getFilms = axios.get('http://localhost:3001/firstQueryFiltering?category=' + params.category + "&type=" + params.type);
        console.log("my films", getFilms);

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
      getFilms.then(value => {  
            
            for(var i=0; i< 50; i++)
                result.splice(i, 0, value.data[i]);
            
            const params2 = {};
            getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params2});
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
                        <div class="dropdown"  style={{ marginLeft:270}}>
                                <button class="dropbtn">Sort list of movies
                                <i className="bx bx-caret-down"></i>
                                </button>
                                
                                <div class="dropdown-content">

                                    <a onClick={() => sorting("", "alphabetical", "asc")}> By Title Ascending (A-Z)</a>
                                    <a onClick={() => sorting("", "alphabetical", "desc")}>By Title Descending (Z-A)</a>
                                    <a onClick={() => sorting("", "rating", "asc")}>By Ratings Ascending</a>
                                    <a onClick={() => sorting("", "rating", "desc")}>By Ratings Descending</a>
                                    <a onClick={() => sorting("", "popularity", "asc")}>By Popularity Ascending</a>
                                    <a onClick={() => sorting("", "popularity", "desc")}>By Popularity Descending</a>
                                    <a onClick={() => sorting("", "year", "asc")}>By Release Date Ascending</a>
                                    <a onClick={() => sorting("", "year", "desc")}>By Release Date Descending</a>
                                </div>
                    </div>

                    <div class="dropdown"  style={{ marginLeft:460}}>
                                <button class="dropbtn"> Filter movies by genre
                                      <i className="bx bx-caret-down"></i>
                                </button>
                                
                                <div class="dropdown-content">
                                { 
                                genres.map((item, i) => (
                                            <a onClick={() => filtering(item, "genre")}> {item}</a>
                                        ))
                                }       
                                </div>
                    </div>

                    <div class="dropdown"  style={{ marginLeft:690}}>
                                <button class="dropbtn">Filter movies by rating
                                <i className="bx bx-caret-down"></i>
                                </button>
                                
                                <div class="dropdown-content">
                                    <a onClick={() => filtering("1", "rating")}> Above rating 1</a>
                                    <a onClick={() => filtering("2", "rating")}>Above rating 2</a>
                                    <a onClick={() => filtering("3", "rating")}>Above rating 3</a>
                                    <a onClick={() => filtering("4", "rating")}>Above rating 4</a>
                                    <a onClick={() => filtering("5", "rating")}>Above rating 5</a>
                                </div>
                    </div>


                    <div class="dropdown"  style={{ marginLeft:920}}>
                                <button class="dropbtn">Filter movies by release years
                                <i className="bx bx-caret-down"></i>
                                </button>
                                <div class="dropdown-content">
                                     <a >View movies between your chosen year and 2022</a>
                                     <input type="number" id="minYear" name="quantity" min="1970" max="2022"  style={{marginLeft:80, backgroundColor:'red'}} onChange={() => filtering([document.getElementById("minYear").value, 2022], "year")}></input>
                                     <a >View movies between 1970 and your chosen year</a>
                                     <input type="number" id="maxYear" name="quantity" min="1970" max="2022"  style={{marginLeft:80, backgroundColor:'red', marginBottom:10}} onChange={() => filtering([1970, document.getElementById("maxYear").value], "year")}></input>
                                </div>

                                
                    </div>
                   
                                    
                        <Link to="/movie">
                            <OutlineButton className="small" style={{marginTop:190}}>View more</OutlineButton>
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
                 genres.map((item, i) => (
                   <div className="section mb-3">
                   <div className="section__header mb-2">
                       <h2>All {item} Movies</h2>
                       <div class="dropdown" style={{ marginLeft:1000}}>
                                <button class="dropbtn">Sort list of movies
                                <i className="bx bx-caret-down"></i>
                                </button>
                                
                                <div class="dropdown-content">

                                    <a onClick={() => sorting(item, "alphabetical", "asc")}> By Title Ascending (A-Z)</a>
                                    <a onClick={() => sorting(item, "alphabetical", "desc")}>By Title Descending (Z-A)</a>
                                    <a onClick={() => sorting(item, "rating", "asc")}>By Ratings Ascending</a>
                                    <a onClick={() => sorting(item, "rating", "desc")}>By Ratings Descending</a>
                                    <a onClick={() => sorting(item, "popularity", "asc")}>By Popularity Ascending</a>
                                    <a onClick={() => sorting(item, "popularity", "desc")}>By Popularity Descending</a>
                                    <a onClick={() => sorting(item, "year", "asc")}>By Release Date Ascending</a>
                                    <a onClick={() => sorting(item, "year", "desc")}>By Release Date Descending</a>
                                </div>
                     </div>

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