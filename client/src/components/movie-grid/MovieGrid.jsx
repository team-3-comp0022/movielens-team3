import React, { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from 'react-router';
import useCollapse from 'react-collapsed';

import './movie-grid.scss';

import MovieCard from '../movie-card/MovieCard';
import Button, { OutlineButton } from '../button/Button';
import Input from '../input/Input'

import tmdbApi, { category, movieType, tvType } from '../../api/tmdbApi';

const MovieGrid = props => {

    const [items, setItems] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    const { keyword, collapse } = useParams();

    useEffect(() => {
        const getList = async () => {
            let response = null;
            if (keyword === undefined) {
                const params = {};
                switch(props.category) {
                    case category.movie:
                        response = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                        break;
                    default:
                        response = await tmdbApi.getTvList(tvType.popular, {params});
                }
            } else {
                const params = {
                    query: keyword
                }
                response = await tmdbApi.search(props.category, {params});
            }
            setItems(response.results);
            setTotalPage(response.total_pages);
        }
        getList();
    }, [props.category, keyword]);

    const loadMore = async () => {
        let response = null;
        if (keyword === undefined) {
            const params = {
                page: page + 1
            };
            switch(props.category) {
                case category.movie:
                    response = await tmdbApi.getMoviesList(movieType.upcoming, {params});
                    break;
                default:
                    response = await tmdbApi.getTvList(tvType.popular, {params});
            }
        } else {
            const params = {
                page: page + 1,
                query: keyword
            }
            response = await tmdbApi.search(props.category, {params});
        }
        setItems([...items, ...response.results]);
        setPage(page + 1);
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
                        <OutlineButton className="small" onClick={loadMore}>Load more</OutlineButton>
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
                history.push(`/${category[props.category]}/search/${keyword}`);
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

        {/* <div class="slider-wrapper">
      <div id="slider-range"></div>

      <div class="range-wrapper">
        <div class="range"></div>
        <div class="range-alert">+</div>

        <div class="gear-wrapper">
          <div class="gear-large gear-one">
            <div class="gear-tooth"></div>
            <div class="gear-tooth"></div>
            <div class="gear-tooth"></div>
            <div class="gear-tooth"></div>
          </div>
          <div class="gear-large gear-two">
            <div class="gear-tooth"></div>
            <div class="gear-tooth"></div>
            <div class="gear-tooth"></div>
            <div class="gear-tooth"></div>
          </div>
        </div>

      </div>

      <div class="marker marker-0"><sup>$</sup>10,000</div>
      <div class="marker marker-25"><sup>$</sup>35,000</div>
      <div class="marker marker-50"><sup>$</sup>60,000</div>
      <div class="marker marker-75"><sup>$</sup>85,000</div>
      <div class="marker marker-100"><sup>$</sup>110,000+</div>
    </div> */}


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
