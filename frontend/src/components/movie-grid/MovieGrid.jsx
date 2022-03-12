import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import useCollapse from 'react-collapsed';
import axios from "axios";

import './movie-grid.scss';

import MovieCard from '../movie-card/MovieCard';
import Button, { OutlineButton } from '../button/Button';
import Input from '../input/Input'

import tmdbApi, { category, movieType } from '../../api/tmdbApi';

const MovieGrid = (props) => {

    var [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [totalResults, setTotalResults] = useState(0);
    const { keyword, collapse } = useParams();

    useEffect(() => {
        const getList = async () => {
            let response = null;
            let responseSearch = null;
            var result = [];
            var getIndexesFromOurDatabase = [];
            if (keyword === undefined) {
                const params = {};
                switch(props.category) {
                    case category.movie:
                        getIndexesFromOurDatabase = await axios.get('http://localhost:3001/findMovieIds')
                        console.log("before ids", getIndexesFromOurDatabase);
                        // Permanently display first 20 movies and load more if necessary - load page 1
                        for (var i = 0; i < 20; i++) // obtain all the movies we want to load max on the page
                            result.push(getIndexesFromOurDatabase.data[i]); // result will have the imdbIds to be appended to the url sent to the api
                        
                        console.log("e in get freaking list", result);
                        getIndexesFromOurDatabase = tmdbApi.getMoviesFromOurDatabase(result, {params}); // getIndexesFromOurDatabase will contained the urls in a list that can be accessed directly to retrieve the movies
                        result = []
                        for (var i = 0; i < 20; i++)  // display first 20 for page 1 
                            getIndexesFromOurDatabase[i].then(value => { 
                                result.push(value.movie_results[0]); // will append the objects or jsons with all the info for each movie
                             });
                                             
                        response = {page:2, results: result, total_pages: 4, total_results: 70}; 
                        console.log("response first", response);                      
                        //response = await tmdbApi.getMoviesList(movieType.popular, {params});   
                        setItems(response.results); // items will firstly contain the first 20 movies to be rendered
                        setTotalResults(response.total_results);
                        setTotalPage(response.total_pages);
                        
                        break;
                       
                }
                
            } else {
                const params = {
                    query: keyword
                }
                var getIndexesFromOurDatabase = [];
                var getIndexes = [];
                getIndexesFromOurDatabase = axios.get('http://localhost:3001/search?query=' + params.query);
                console.log("my ids", getIndexesFromOurDatabase);

                result = [];
                getIndexesFromOurDatabase.then(value => {  
                    console.log("idk", value.data.length);
                    for(var i=0; i< value.data.length; i++)
                        //result.push(value.data[0].imdbId); 
                        result.splice(i, 0, value.data[i]);
                    console.log("params", result);
                    const params2 = {};
                    getIndexes = tmdbApi.getMoviesFromOurDatabase(result, {params2});
                    console.log("new", getIndexes);

                    var result2 = []
               
                    for (var i = 0; i < value.data.length; i++)  // display first 20 for page 1 
                         getIndexes[i].then(value => { 
                            result2.push(value.movie_results[0]); // will append the objects or jsons with all the info for each movie
                        });
                                        
                    responseSearch = {page:1, results: result2, total_pages: 4, total_results: value.data.length};                   
                    console.log("responseSearch", responseSearch);    
                    setItems(responseSearch.results); // items will firstly contain the first 20 movies to be rendered
                    console.log("vreau sa vad", items);
                    setTotalResults(responseSearch.total_results);
                    setTotalPage(responseSearch.total_pages);
                });
            }
        }
        getList();
       
    }, [props.category, keyword]);

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

                    //console.log("i am in loading"); console.log("mypage", page); 
                    var limit; 
                    var noOfMovies = 20;
                    if(20*(page+1) >= totalResults) {limit =  totalResults; noOfMovies = totalResults - 20*(page);}
                    else limit = 20*(page+1);
                    for (var i=20*page; i < limit; i++) // obtain all the movies we want to load max on the page
                        result.push(getIndexesFromOurDatabase.data[i]); // result will have the imdbIds to be appended to the url sent to the api
                        
                    getIndexesFromOurDatabase = tmdbApi.getMoviesFromOurDatabase(result, {params});
                    var sp = [];
                    //console.log("prior global", sp);
                    for (var i = 0; i < noOfMovies; i++) {  
                        getIndexesFromOurDatabase[i].then(value => {  // getIndexesFromOurDatabase will contained the urls in a list that can be accessed directly to retrieve the movies
                            sp.splice(i, 0, value.movie_results[0]);
                            setItems([...items, ...sp]);
                        }); 
                    }
                    
                    response = {page:page, results: sp, total_pages: 3, total_results: 50};
                    //response = await tmdbApi.getMoviesList(movieType.popular, {params});
                    //console.log("myitems", items); 
                    break;
                
            }
        } else {
            const params = {
                page: page + 1,
                query: keyword
            }
            response = await tmdbApi.search({params});
        }
        setPage(page+1);
        //setItems([...items, ...response.results]);
    }

    return (
        <>
            <div className="section mb-0" >
               <MovieSearch category={props.category} keyword={keyword}/>  
             </div>
           
               <div className="section mb-3" >
                <Collapsible category={props.category} collapse={collapse}/> 
             </div>
            <div className="movie-grid">
                {
                    items.map((item, i) => <MovieCard category={props.category} item={item} key={i}/>)
                }
            </div>
            {
                page < totalPage ? (
                    <div className="movie-grid__loadmore">
                        <OutlineButton className="small" onClick={loadMore}>Load page {page+1} of movies</OutlineButton>
                    
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

function Collapsible() {
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
               
                {isExpanded ? 'Collapse Advanced Search' : 'Click Here for Advanced Search' }
                
            </div>
            <div {...getCollapseProps()}>
                <div className="content" > 
                    
                     
      <div class="grid">
	   <div class="col">
	    <h5>   Display the movies <br/><br/> </h5>
        <div class="hr"></div>

              <label class="specialcontainer" style={{display:'block',textAlign:'left'}}> Not yet watched
                        <input type="radio" name="radio"></input>
                        <span class="checkmark"></span>
                    </label>
                    <label class="specialcontainer" style={{display:'block',textAlign:'left'}}>Already watched
                        <input type="radio" name="radio"></input>
                        <span class="checkmark"></span>
                     </label>
                    <label class="specialcontainer" style={{display:'block',textAlign:'left'}}> Both watched and not watched
                        <input type="radio" name="radio"></input>
                        <span class="checkmark"></span>
                    </label>

        <div class="col2" style={{marginTop:38, marginLeft:-10,}}>
	    <h5>   Runtime <br/><br/> </h5>
        <div class="hr"></div>

             </div>
	   </div>
       
	   <div class="col">
        <h5>   Availabilities <br/><br/> </h5>
        <div class="hr"></div>
        <div class="grid">

		    <div class="columnn"> 
            <label class="specialcontainer" style={{display:'block',textAlign:'left'}}> Stream
            <input type="checkbox" name="checkbox" />
            <span class="checkbox"></span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left'}}> Free
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox"></span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left'}}> Ads
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox"></span>
            </label>
            </div>

            <div class="columnn"> 
            <label class="specialcontainer" style={{display:'block',textAlign:'left'}}> Buy
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox"></span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left'}}> Rent
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox"></span>
            </label>
            </div>
            </div>
            
            <div class="col2" style={{marginTop:60, marginLeft:-10,}}>
         {/* <div class="col" style={{marginTop:20, width: '25%', height: '200px', padding: '10px', margin: '5px'}}>    */}
	    <h5>   Ratings <br/><br/> </h5>
        <div class="hr"></div>
        <div class="grid" style={{align:'center'}}>

            
            <label class="specialcontainer" style={{display:'inline',textAlign:'left', padding:20, marginLeft: 30}}> 
            <input type="radio" name="radio"></input>
            <span class="checkmarkrating" style={{padding:4,width:30, height:30,color:'black', textAlign:'center', fontWeight: 'bold' }}>1</span>
            </label>
            
            <label class="specialcontainer" style={{display:'inline',textAlign:'left', padding:20}}> 
            <input type="radio" name="radio"></input>
            <span class="checkmarkrating" style={{padding:4,width:30, height:30,color:'black', textAlign:'center', fontWeight: 'bold' }}>2</span>
            </label>

            <label class="specialcontainer" style={{display:'inline',textAlign:'left', padding:20}}> 
            <input type="radio" name="radio"></input>
            <span class="checkmarkrating" style={{padding:4,width:30, height:30,color:'black', textAlign:'center', fontWeight: 'bold' }}>3</span>
            </label>

            <label class="specialcontainer" style={{display:'inline',textAlign:'left', padding:20}}> 
            <input type="radio" name="radio"></input>
            <span class="checkmarkrating" style={{padding:4,width:30, height:30,color:'black', textAlign:'center', fontWeight: 'bold' }}>4</span>
            </label>

            <label class="specialcontainer" style={{display:'inline',textAlign:'left', padding:20}}> 
            <input type="radio" name="radio"></input>
            <span class="checkmarkrating" style={{padding:4,width:30, height:30,color:'black', textAlign:'center', fontWeight: 'bold' }}>5</span>
            </label>
            </div>
             
             </div>


{/* 
                <div id="form-wrapper">
                <form action="/p/quote.php" method="GET">
                    <h1 id="form-title">Select Debt Amount</h1>
                    <div id="debt-amount-slider">
                    <input type="radio" name="debt-amount" id="1" value="1" required></input>
                    <label for="1" data-debt-amount="< $10k"></label>
                    <input type="radio" name="debt-amount" id="2" value="2" required></input>
                    <label for="2" data-debt-amount="$10k-25k"></label>
                    <input type="radio" name="debt-amount" id="3" value="3" required></input>
                    <label for="3" data-debt-amount="$25k-50k"></label>
                    <input type="radio" name="debt-amount" id="4" value="4" required></input>
                    <label for="4" data-debt-amount="$50k-100k"></label>
                    <input type="radio" name="debt-amount" id="5" value="5" required></input>
                    <label for="5" data-debt-amount="$100k+"></label>
                    <div id="debt-amount-pos"></div>
                    </div>
                </form>
                <button type="submit">Get Debt Free!</button>
                </div> */}


           
	   </div>

	   <div class="col" style={{width:500, height:350}}>
       <h5>   Genres <br/><br/> </h5>
       <div class="hr"></div>
         <div class="grid">
         <div class="columngen" style={{padding:0, marginLeft:20}}> 
            <label class="specialcontainer" style={{display:'block',textAlign:'left'}}>
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:80, height:30, borderRadius:'16px',color:'black' }}>Action</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:50}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:100, height:30, borderRadius:'16px',color:'black'}}>Adventure</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:100}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:80, height:30, borderRadius:'16px',color:'black'}}>Drama</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:150}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:80, height:30, borderRadius:'16px',color:'black'}}>History</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:200}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:40, height:30, borderRadius:'16px',color:'black'}}>War </span>
            </label>
            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:250}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:80, height:30, borderRadius:'16px',color:'black'}}>Mystery</span>
            </label>
         </div>
        
         <div class="columngen" style={{padding:0, marginLeft:0}}> 
         <label class="specialcontainer" style={{display:'block',textAlign:'left'}}>
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:70, height:30, borderRadius:'16px',color:'black'}}>Crime</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:50}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:100, height:30, borderRadius:'16px',color:'black'}}>Comedy</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:100}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:90, height:30, borderRadius:'16px',color:'black'}}>Family</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:150}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:70, height:30, borderRadius:'16px',color:'black'}}>Horror</span>
            </label>
            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:200}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:90, height:30, borderRadius:'16px',color:'black'}}>Romance</span>
            </label>
            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:250}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:80, height:30, borderRadius:'16px',color:'black'}}>Thriller</span>
            </label>
         </div>
         

         <div class="columngen" style={{padding:0, marginLeft:30}}> 
           
         <label class="specialcontainer" style={{display:'block',textAlign:'left'}}>
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:110, height:30, borderRadius:'16px', marginLeft:-10, color:'black'}}>Animation</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:50}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:120, height:30, borderRadius:'16px', marginLeft:-10,color:'black'}}>Documentary</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:100}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:90, height:30, borderRadius:'16px', marginLeft:-10,color:'black'}}>Fantasy</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:150}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:70, height:30, borderRadius:'16px',color:'black'}}>Music</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:200}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:130, height:30, borderRadius:'16px', marginLeft:-10,color:'black'}}>Science Fiction</span>
            </label>

            <label class="specialcontainer" style={{display:'block',textAlign:'left', marginTop:250}}> 
            <input type="checkbox" name="checkbox-checked" /> 
            <span class="checkbox" style={{width:90, height:30, borderRadius:'16px',color:'black'}}>Western</span>
            </label>
         </div>

         

         </div>
	   </div>

       <div class="col">
       <h5>   Release dates <br/><br/> </h5>
       <div class="hr"></div>
       <div class="select">
            <select name="slct" id="slct"  style={{marginLeft:'20px', width:250, height:50, marginLeft:-20, backgroundColor:'#ccc'}}>
                <option style={{marginLeft:'20px', textAlign:'center'}}>Select date- add calendar</option>
            
            </select>
        </div>

        
          </div>

          <div class="col2" style={{marginTop:215, marginLeft:987, width:300}}>
         {/* <div class="col" style={{marginTop:20, width: '25%', height: '200px', padding: '10px', margin: '5px'}}>    */}
	    <h5>  Language <br/><br/> </h5>
             <div class="hr"></div>
             <div class="select">
            <select name="slct" id="slct"  style={{width:250, height:50, marginLeft:-50, backgroundColor:'#ccc'}}>
                <option style={{marginLeft:'10px', textAlign:'center'}}>Select Language</option>
                
                <option value="1">English</option>
                <option value="2">French</option>
                <option value="3">German</option>
                <option value="4">Chinese</option>
                <option value="5">Japanese</option>
                <option value="6">Russian</option>
     
            </select>
        </div>
             
             </div>
	   
          
	</div>
                   
   


                </div>
            </div>
        </div>
    );
}


export default MovieGrid;
