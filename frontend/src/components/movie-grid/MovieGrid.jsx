import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import { useRef } from "react";
import useCollapse from 'react-collapsed';
import axios from "axios";
import './movie-grid.scss';
import MovieCard from '../movie-card/MovieCard';
import Button, { OutlineButton } from '../button/Button';
import Input from '../input/Input'
import tmdbApi, { category } from '../../api/tmdbApi';

const MovieGrid = (props) => {

    var [items, setItems] = useState([]);
    const [genres, setGenres] = useState([])
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const { keyword } = useParams();

    useEffect(() => {
        const getList = async () => {

            
            let response = null;
            let responseSearch = null;
            var result = [];
            var getIndexesFromOurDatabase = [];

            var listOfGenres = await axios.get('http://localhost:3001/getGenre');
            listOfGenres = listOfGenres.data.slice(0, 19); // the 20th is "no genre available" so exclude it
            for (var i = 0; i < 19; i++) 
            listOfGenres[i] = listOfGenres[i].genre; 
            setGenres(listOfGenres);  

            if (keyword === undefined) {
                console.log("SMTHHHH", genres);

                const params = {};
                
                        getIndexesFromOurDatabase = await axios.get('http://localhost:3001/findMovieIds')
                        // Permanently display first 20 movies and load more if necessary - load page 1
                        for (var i = 0; i < 20; i++) // obtain all the movies we want to load max on the page
                            result.push(getIndexesFromOurDatabase.data[i]); // result will have the imdbIds to be appended to the url sent to the api
                        
                        getIndexesFromOurDatabase = tmdbApi.getMoviesFromOurDatabase(result, {params}); // getIndexesFromOurDatabase will contained the urls in a list that can be accessed directly to retrieve the movies
                        result = []
                        for (var i = 0; i < 20; i++)  // display first 20 for page 1 
                            getIndexesFromOurDatabase[i].then(value => { 
                                result.push(value.movie_results[0]); // will append the objects or jsons with all the info for each movie
                             });
                                             
                        response = {page:2, results: result, total_pages: 4, total_results: 70}; 
                        setItems(response.results); // items will firstly contain the first 20 movies to be rendered
                        setTotalResults(response.total_results);
                        setTotalPage(response.total_pages);
                        
                    
            } else {
                const params = {
                    query: keyword
                }
                var getIndexesFromOurDatabase = [];
                var getIndexes = [];
                getIndexesFromOurDatabase = axios.get('http://localhost:3001/search?query=' + params.query);
                result = [];
                getIndexesFromOurDatabase.then(value => {  
                    for(var i=0; i< value.data.length; i++)
                        //result.push(value.data[0].imdbId); 
                        result.splice(i, 0, value.data[i]);
                    const params2 = {};
                    getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params2});

                    var result2 = []
               
                    for (var i = 0; i < value.data.length; i++)  // display first 20 for page 1 
                         getIndexes[i].then(value => { 
                            result2.push(value.movie_results[0]); // will append the objects or jsons with all the info for each movie
                        });
                                        
                    responseSearch = {page:1, results: result2, total_pages: 4, total_results: value.data.length};                   
                    setItems(responseSearch.results); // items will firstly contain the first 20 movies to be rendered
                    setTotalResults(responseSearch.total_results);
                    setTotalPage(responseSearch.total_pages);
                });
            }
        }
        getList();
        
       
    }, [props.category, keyword]);


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
    category: category_arg, //["Drama",2010,2015],
    type: type_arg
  }
    var getFilms = axios.get('http://localhost:3001/firstQueryFiltering?category=' + params.category + "&type=" + params.type);
   
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

    const loadMore = async () => {
        let response = null;
        var result = undefined || [];
        var getIndexesFromOurDatabase = [];
        if (keyword === undefined) {
            const params = {
                page: page + 1
            };
            switch(props.category) {
                case category.movie:
                    getIndexesFromOurDatabase = await axios.get('http://localhost:3001/findMovieIds');
 
                    var limit; 
                    var noOfMovies = 20;
                    if(20*(page+1) >= totalResults) {limit =  totalResults; noOfMovies = totalResults - 20*(page);}
                    else limit = 20*(page+1);
                    for (var i=20*page; i < limit; i++) // obtain all the movies we want to load max on the page
                        result.push(getIndexesFromOurDatabase.data[i]); // result will have the imdbIds to be appended to the url sent to the api
                        
                    getIndexesFromOurDatabase = tmdbApi.getMoviesFromOurDatabase(result, {params});
                    var sp = [];
                    for (var i = 0; i < noOfMovies; i++) {  
                        getIndexesFromOurDatabase[i].then(value => {  // getIndexesFromOurDatabase will contained the urls in a list that can be accessed directly to retrieve the movies
                            sp.splice(i, 0, value.movie_results[0]);
                            setItems([...items, ...sp]);
                        }); 
                    }
                    
                    response = {page:page, results: sp, total_pages: 3, total_results: 50};
                    break;
                
            }
        } 
        setPage(page+1);
    }

    return (
        <>
            <div className="section mb-0" >
               <MovieSearch category={props.category} keyword={keyword} />  

              
             </div>
             <div className="section mb-0" >
             <div class="dropdown"  style={{ marginLeft:730, marginTop:-28}}>
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
            </div>

             <div class="dropdown"  style={{ marginLeft:950, marginTop:-28}}>
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

                    <div class="dropdown"  style={{ marginLeft:1170,  marginTop:-28}}>
                                <button class="dropbtn">Filter movies by rating
                                <i className="bx bx-caret-down"></i>
                                </button>
                                
                                <div class="dropdown-content">

                                    <a onClick={() =>  filtering("1", "rating")}> Above rating 1</a>
                                    <a onClick={() => filtering("2", "rating")}>Above rating 2</a>
                                    <a onClick={() => filtering("3", "rating")}>Above rating 3</a>
                                    <a onClick={() => filtering("4", "rating")}>Above rating 4</a>
                                    <a onClick={() => filtering("5", "rating")}>Above rating 5</a>
                                </div>
                    </div>


                    <div class="dropdown"  style={{ marginLeft:920, marginTop:30}}>
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

            
                
            <div className="movie-grid" style={{marginTop:100}}>
                {
                    items.map((item, i) => <MovieCard category={props.category} item={item} key={i}/>)
                }
            </div>
            {
                page < totalPage ? (
                    <div className="movie-grid__loadmore" style={{marginLeft:-400}}>
                        <OutlineButton className="small" onClick={loadMore}>Load more movies</OutlineButton>
                           
                    </div>
                ) : null
            }
        </>
    );
}


const MovieSearch = props => {
    const history = useHistory();
    const [keyword, setKeyword] = useState(props.keyword ? props.keyword : '');
    const goToSearch = useCallback(
        () => {
            if (keyword.trim().length > 0) {
                history.push(`/movie/search/${keyword}`);
            }
        },
        [keyword, props.category, history]
    );

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToSearch();
            }
        }
        document.addEventListener('keyup', enterEvent);
        return () => {
            document.removeEventListener('keyup', enterEvent);
        };
    }, [keyword, goToSearch]);

    return (
        <div className="movie-search" >
            <Input
                type="text"
                placeholder="Enter keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <Button className="small" onClick={goToSearch}>Search</Button>


           
        </div>
    )
}

const Genres = props => {
    var listOfGenres = axios.get('http://localhost:3001/getGenre');
    var [genres, setGenres] = useState([])
    const [checked, setChecked] = useState([]);
    const [checkList, setCheckList] = useState([]);
    const history = useHistory();
   
    var result = []
    listOfGenres.then(value => {  
        for(var i=0; i< 19; i++){
            result.splice(i, 0, value.data[i].genre);
          
        }
        setCheckList(result);
        // setGenres(result);
    })
    const genresList = checkList;
    const handleCheck = (event) => {
        var updatedList = [...checked];
        if (event.target.checked) {
          updatedList = [...checked, event.target.value];
        } else {
          updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
    };

    const checkedItems = checked.length
    ? checked.reduce((total, item) => {
        return total + ", " + item;
      })
    : "";

    const goToLink = useCallback(
        () => {
            handleCheck();
            if (genres.length > 0) {
                history.push(`/movie/advanced/search/`);
            }
        },
        [genres, history]
    );

    useEffect(() => {
        const enterEvent = (e) => {
            e.preventDefault();
            if (e.keyCode === 13) {
                goToLink();
            }
        }
        document.addEventListener('keyup', enterEvent);
        return () => {
            document.removeEventListener('keyup', enterEvent);
        };
    }, [genres, goToLink]);

    return  (
        <div className="grid">
            {/* <div className="list-container"> */}
            <div class="columngen" style={{padding:0, marginLeft:30}}> 
            {genresList.slice(0,7).map((item, index) => (
                <div key={index%5==0}>
                     <label class="specialcontainer" style={{display:'block',textAlign:'left'}}>
                    <input value={item} type="checkbox"  onChange={handleCheck} />
                    {/* <span class="checkbox" >{item}</span> */}
                    <span class="checkbox" style={{width:90, height:30, borderRadius:'16px',color:'black' }}>{item}</span>
                    </label>
                </div>
                ))}
            </div>
            <div class="columngen" style={{padding:0, marginLeft:30}}> 
            {genresList.slice(7,13).map((item, index) => (
                <div key={index%5==0}>
                     <label class="specialcontainer" style={{display:'block',textAlign:'left'}}>
                    <input value={item} type="checkbox"  onChange={handleCheck} />
                    {/* <span class="checkbox" >{item}</span> */}
                    <span class="checkbox" style={{width:80, height:30, borderRadius:'16px',color:'black' }}>{item}</span>
                    </label>
                </div>
                ))}
        </div> <div className="list-container">
            {genresList.slice(13,20).map((item, index) => (
                <div key={index%5==0}>
                     <label class="specialcontainer" style={{display:'block',textAlign:'left'}}>
                    <input value={item} type="checkbox"  onChange={handleCheck} />
                    {/* <span class="checkbox" >{item}</span> */}
                    <span class="checkbox" style={{width:110, height:30, borderRadius:'16px',color:'black' }}>{item}</span>
                    </label>
                </div>
                ))}
        </div>
                    <div>
                    
                    {`Items checked are: ${checkedItems}`}
                </div>
    </div>
    )
}


const Collapsible = props => {
    const [ isExpanded, setExpanded ] = useState(false);
    const { getCollapseProps, getToggleProps } = useCollapse({ isExpanded });
    function handleOnClick() {
        // Do more stuff with the click event!
        // Or, set isExpanded conditionally 
        setExpanded(!isExpanded);
    }
return (
        <div className="collapsible">
            <div className="header" {...getToggleProps({onClick: handleOnClick})}>
               
                {isExpanded ? 'Collapse Advanced Search' : 'Tailor Your Search With Advanced Filters' }
                
            </div>
            <div {...getCollapseProps()}>
                <div className="content" > 

                <div class="col" style={{width:500, height:350}}>
                <h5>   Genres <br/><br/> </h5>
                        <div class="hr"></div>
                        <Genres/>
                        
                </div>

                <div class="col" style={{width:500, height:350}}>
                <h5>   Ratings <br/><br/> </h5>
                        <div class="hr"></div>
                       <h5> Select the Minimum Boundary for the Rating Interval</h5>
                        <div class="select">
                    <select name="slct" id="slct"  style={{width:250, height:50, marginLeft:-50, backgroundColor:'#ccc'}}>
                        <option style={{marginLeft:'10px', textAlign:'center'}}>Select Minimum Rating</option>
                        
                        <option value="1">Rating 1</option>
                        <option value="2">Rating 2</option>
                        <option value="3">Rating 3</option>
                        <option value="4">Rating 4</option>
                        <option value="5">Rating 5</option>
            
                    </select>
                </div><br></br>
                <h5> Select the Maximum Boundary for the Rating Interval</h5>
                <div class="select">
                    <select name="slct" id="slct"  style={{width:250, height:50, marginLeft:-50, backgroundColor:'#ccc'}}>
                        <option style={{marginLeft:'10px', textAlign:'center'}}>Select Maximum Rating</option>
                        
                        <option value="1">Rating 1</option>
                        <option value="2">Rating 2</option>
                        <option value="3">Rating 3</option>
                        <option value="4">Rating 4</option>
                        <option value="5">Rating 5</option>
            
                    </select>
                </div>
                        
                </div>

                <div class="col" style={{width:500, height:350}}>
                <h5>   Release Year <br/><br/> </h5>
                        <div class="hr"></div>
                      
                        <h5> Select the Minimum Boundary for the Year Interval</h5>
                        <div class="select">
                    <select name="slct" id="slct"  style={{width:250, height:50, marginLeft:-50, backgroundColor:'#ccc'}}>
                        <option style={{marginLeft:'10px', textAlign:'center'}}>Select Minimum Year</option>
                        
                        <option value="1">2000</option>
                        <option value="2">2001</option>
                        <option value="3">2002</option>
                        <option value="4">2003</option>
                        <option value="5">2004</option>
                        <option value="6">2005</option>
                        <option value="7">2006</option>
                        <option value="8">2007</option>
                        <option value="9">2008</option>
                        <option value="10">2009</option>
                        <option value="11">2010</option>
                        <option value="12">2011</option>
                        <option value="13">2012</option>
                        <option value="14">2013</option>
                        <option value="15">2014</option>
                        <option value="16">2015</option>
                        <option value="17">2016</option>
                        <option value="18">2017</option>
                        <option value="19">2018</option>
                        <option value="20">2019</option>
                        <option value="21">2020</option>
                        <option value="22">2021</option>
                        <option value="23">2022</option>
                      
                    </select>
                </div><br></br>
                <h5> Select the Maximum Boundary for the Year Interval</h5>
                <div class="select">
                    <select name="slct" id="slct"  style={{width:250, height:50, marginLeft:-50, backgroundColor:'#ccc'}}>
                        <option style={{marginLeft:'10px', textAlign:'center'}}>Select Maximum Year</option>
                        
                        <option value="1">2000</option>
                        <option value="2">2001</option>
                        <option value="3">2002</option>
                        <option value="4">2003</option>
                        <option value="5">2004</option>
                        <option value="6">2005</option>
                        <option value="7">2006</option>
                        <option value="8">2007</option>
                        <option value="9">2008</option>
                        <option value="10">2009</option>
                        <option value="11">2010</option>
                        <option value="12">2011</option>
                        <option value="13">2012</option>
                        <option value="14">2013</option>
                        <option value="15">2014</option>
                        <option value="16">2015</option>
                        <option value="17">2016</option>
                        <option value="18">2017</option>
                        <option value="19">2018</option>
                        <option value="20">2019</option>
                        <option value="21">2020</option>
                        <option value="22">2021</option>
                        <option value="23">2022</option>
            
                    </select>
                </div>
                        
                </div>

               
     


                </div>
                <Button className="small" style={{marginLeft:130}}>Advanced Search</Button>

            </div>

        </div>
    );
}


export default MovieGrid;