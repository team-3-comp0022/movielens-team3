import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';

import tmdbApi from '../../api/tmdbApi';
import apiConfig from '../../api/apiConfig';

import './detail.scss';
import CastList from './CastList';
import VideoList from './VideoList';

import MovieList from '../../components/movie-list/MovieList';
import axios from 'axios';
import ReactSpeedometer from "react-d3-speedometer";
import { HorizontalBar } from 'react-chartjs-2';
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
/*

1. Browsing visual lists of films in the database, allowing lists to be selected and sorted by user specified parameters.
    - Not applicable to this
    - popularity by asc, desc - no of viewers
    - rating asc, desc - rating
    - movie name alphabetical order, asc, desc - alphabetical order
    - release date, asc, desc - release date


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
    const [barItems, setBarItems] = useState([]);
    const [barItems2, setBarItems2] = useState([]);

    useEffect(() => {
        const getDetail = async () => {
            const response = await tmdbApi.detail(category, id, {params:{}});
            setItem(response);

            function functionOne(_callback){
                // do some asynchronus work 
                _callback();
            }

           
            // function functionTwo(){
            //     // do some asynchronus work 
            //     //responseFromOurDb = tmdbApi.getMovieInfo(id, {params:id});

                
            //     });
                                

            //     functionOne(()=>{

            //     });
            // }
            
            // functionTwo();
            var responseFromOurDb = [];
            responseFromOurDb = await axios.get("http://localhost:3001/getReportData?query="+id, {params:id});
            console.log("prima", responseFromOurDb);
            setItems(responseFromOurDb.data);
            // responseFromOurDb = axios.get("http://localhost:3001/getReportData?query="+id, {params:id});
            // console.log("doi", responseFromOurDb);
            // responseFromOurDb.then((response) => {
            //         //RESPONSE IS THE IDS
            //         console.log("Hey")
            //         console.log(response);
            //         setItems(response.data);
            //  });
            var barItemsTemp = [
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].actual_agreeableness) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].difference_agreeableness) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].predicted_agreeableness) || 0,

                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].actual_conscientiousness) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].difference_conscientiousness) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].predicted_conscientiousness) || 0,

                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].actual_emotional_stability) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].difference_emotional_stability) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].predicted_emotional_stability) || 0,

                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].actual_extraversion) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].difference_extraversion) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].predicted_extraversion) || 0,

                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].actual_openness) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].difference_openness) || 0,
                (responseFromOurDb.data[2][0] && responseFromOurDb.data[2][0].predicted_openness) || 0,
             ]
             var barItemsTemp2 = [
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].actual_agreeableness) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].difference_agreeableness) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].predicted_agreeableness) || 0,

             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].actual_conscientiousness) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].difference_conscientiousness) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].predicted_conscientiousness) || 0,

             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].actual_emotional_stability) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].difference_emotional_stability) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].predicted_emotional_stability) || 0,

             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].actual_extraversion) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].difference_extraversion) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].predicted_extraversion) || 0,

             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].actual_openness) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].difference_openness) || 0,
             (responseFromOurDb.data[3][0] && responseFromOurDb.data[2][0].predicted_openness) || 0,
             ]

            setBarItems(barItemsTemp);
            setBarItems2(barItemsTemp2);
            window.scrollTo(0,0);
        }
        getDetail();
    }, [category, id]);
               
    return (
        <>
            {
               barItems2 && barItems && dbItems && item && (
                    <>
                        <div className="wrapper" style={{backgroundImage: `url(${apiConfig.originalImage(item.backdrop_path || item.poster_path)})`}}>
                        <script>
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
                                    <h3 style={{marginLeft:35, marginBottom:10}} > RATING</h3>
                                     <ReactSpeedometer
                                        minValue={1}
                                        maxValue={5}
                                        value={dbItems[0][0][0].average_rating || 0}
                                        needleColor="#666"
                                        startColor="green"
                                        segments={5}
                                        endColor="blue"
                                        width={150}
                                        ringWidth={20}
                                        height={250}
                                        needleHeightRatio={0.7}
                                        />
                                        <h3 style={{marginLeft:70, marginBottom:10, marginTop:-180}} > {dbItems[0][0][0].average_rating || 0}</h3>
                                {/* <div className="score" style={{marginTop:-170, marginLeft:60}}>{dbItems[0][0][0].average_rating || 0}</div> */}

                                </div>


                                <div className='director'>
                                    <h3 style={{marginLeft:-5, marginBottom:10}}>PREDICTED RATING</h3>
                                    <div style={{marginLeft:20}}>
                                    <ReactSpeedometer
                                        minValue={1}
                                        maxValue={5}
                                        value={dbItems[1][0].p_rating || 0}
                                        needleColor="#666"
                                        startColor="yellow"
                                        segments={5}
                                        endColor="red"
                                        width={150}
                                        ringWidth={20}
                                        height={250}
                                        needleHeightRatio={0.7}
                                        />
                                        </div>
                                     <h3  style={{marginLeft:70, marginBottom:10, marginTop:-180}}>{dbItems[1][0].p_rating || 0}</h3>
                                </div>

                                 
                                 </div>

                                <div className='ratings'>
                                        {
                                            dbItems && dbItems[0][1].map((r, i) => (
                                                <p >No. of users with rating {r.rating}: {r.noOfRatings}</p>
                                            ))
                                        }

                                 </div>
                                
                                 

                                 <div className="detailedRatings">
                                    <h3>RATINGS STATISTICS</h3>
                                    <h5>Aggregate rating: {(dbItems[0][0][0] && dbItems[0][0][0].aggregate_Rating) || 0}</h5>              
                                    <h5>Total no. of reviewers: {dbItems[1][0].total_viewers}</h5>              
                                    <h5>Variance of the ratings: {(dbItems[0][0][0] && dbItems[0][0][0].variance_Rating) || 0}</h5>
                                    <br />

                                    <h3>PREDICTED RATINGS</h3>
                                    <h5>Actual Aggregate rating: {(dbItems[1][0] && dbItems[1][0].real_rating) || 0}</h5>
                                    <h5>Predicted Aggregate rating: {(dbItems[1][0] && dbItems[1][0].predicted_rating) || 0}</h5>
                                    <br />
                                    <h5>Actual Rating: {(dbItems[1][0] && dbItems[0][0][0].average_rating) || 0}</h5>
                                    <h5>Predicted Rating: {(dbItems[1][0] && dbItems[1][0].p_rating) || 0}</h5>
                                    <br />
                                    <h5>Total no. of reviewers: {dbItems[1][0].total_viewers}</h5>              
                                    <h5>No. of reviewers in subset: {dbItems[1][0].subset_viewers}</h5>              

                                    <br />

                                    <h3>PREDICTED PERSONALITY TRAITS</h3>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 99, 132, 0.4)"}}>Actual Agreeableness: {(dbItems[2][0] && dbItems[2][0].actual_agreeableness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 205, 86, 0.4)"}}>Difference Agreeableness: {(dbItems[2][0] && dbItems[2][0].difference_agreeableness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(75, 192, 192, 0.4)"}}>Predicted Agreeableness: {(dbItems[2][0] && dbItems[2][0].predicted_agreeableness) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 99, 132, 0.4)"}}>Actual Conscientiousness: {(dbItems[2][0] && dbItems[2][0].actual_conscientiousness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 205, 86, 0.4)"}}>Difference Conscientiousness: {(dbItems[2][0] && dbItems[2][0].difference_conscientiousness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(75, 192, 192, 0.4)"}}>Predicted Conscientiousness: {(dbItems[2][0] && dbItems[2][0].predicted_conscientiousness) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 99, 132, 0.4)"}}>Actual Emotional Stability: {(dbItems[2][0] && dbItems[2][0].actual_emotional_stability) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 205, 86, 0.4)"}}>Difference Emotional Stability: {(dbItems[2][0] && dbItems[2][0].difference_emotional_stability) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(75, 192, 192, 0.4)"}}>Predicted Emotional Stability: {(dbItems[2][0] && dbItems[2][0].predicted_emotional_stability) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 99, 132, 0.4)"}}>Actual Extraversion: {(dbItems[2][0] && dbItems[2][0].actual_extraversion) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 205, 86,0.4)"}}>Difference Extraversion: {(dbItems[2][0] && dbItems[2][0].difference_extraversion) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(75, 192, 192, 0.4)"}}> Predicted Extraversion: {(dbItems[2][0] && dbItems[2][0].predicted_extraversion) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 99, 132, 0.4)"}}>Actual Openness: {(dbItems[2][0] && dbItems[2][0].actual_openness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 205, 86, 0.4)"}}>Difference Openness: {(dbItems[2][0] && dbItems[2][0].difference_openness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(75, 192, 192, 0.4)"}}>Predicted Openness: {(dbItems[2][0] && dbItems[2][0].predicted_openness) || 0}</h5>
                                    <br />

                    <div className="grid">     
        <Bar 
        data={{
      labels: ['Actual Agreeableness', 
      'Difference Agreeableness',
      'Predicted Agreeableness', 
      'Actual Conscientiousness', 
      'Difference Conscientiousness', 
      'Predicted Conscientiousness',
      'Actual Emotional Stability', 
      'Difference Emotional Stability', 
      'Predicted Emotional Stability',
      'Actual Extraversion', 
      'Difference Extraversion', 
      'Predicted Extraversion',
      'Actual Openness', 
      'Difference Openness', 
      'Predicted Openness'
    ],
      datasets: [
        {
            backgroundColor: [
                'rgba(255, 99, 132)',
                'rgba(255, 205, 86)',
                'rgba(75, 192, 192)'
              ],
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          label:"",
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: barItems
        }
      ]
    }} />
    </div>  
                                    <br />
                                    <h3>PREDICTED PERSONALITY TYPES</h3>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 159, 64, 0.4)"}}> Actual Agreeableness: {(dbItems[3][0] && dbItems[2][0].actual_agreeableness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(54, 162, 235, 0.4)"}}>Difference Agreeableness: {(dbItems[3][0] && dbItems[2][0].difference_agreeableness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(153, 102, 255, 0.4)"}}>Predicted Agreeableness: {(dbItems[3][0] && dbItems[2][0].predicted_agreeableness) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 159, 64, 0.4)"}}>Actual Conscientiousness: {(dbItems[3][0] && dbItems[2][0].actual_conscientiousness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(54, 162, 235, 0.4)"}}>Difference Conscientiousness: {(dbItems[3][0] && dbItems[2][0].difference_conscientiousness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(153, 102, 255, 0.4)"}}>Predicted Conscientiousness: {(dbItems[3][0] && dbItems[2][0].predicted_conscientiousness) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 159, 64, 0.4)"}}>Actual Emotional Stability: {(dbItems[3][0] && dbItems[2][0].actual_emotional_stability) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(54, 162, 235, 0.4)"}}>Difference Emotional Stability: {(dbItems[3][0] && dbItems[2][0].difference_emotional_stability) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(153, 102, 255, 0.4)"}}>Predicted Emotional Stability: {(dbItems[3][0] && dbItems[2][0].predicted_emotional_stability) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 159, 64, 0.4)"}}>Actual Extraversion: {(dbItems[3][0] && dbItems[2][0].actual_extraversion) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(54, 162, 235, 0.4)"}}>Difference Extraversion: {(dbItems[3][0] && dbItems[2][0].difference_extraversion) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(153, 102, 255, 0.4)"}}>Predicted Extraversion: {(dbItems[3][0] && dbItems[2][0].predicted_extraversion) || 0}</h5>
                                    <br />

                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(255, 159, 64, 0.4)"}}>Actual Openness: {(dbItems[3][0] && dbItems[2][0].actual_openness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(54, 162, 235, 0.4)"}}>Difference Openness: {(dbItems[3][0] && dbItems[2][0].difference_openness) || 0}</h5>
                                    <h5 className="genres__item"  style={{backgroundColor:"rgba(153, 102, 255, 0.4)"}}>Predicted Openness: {(dbItems[3][0] && dbItems[2][0].predicted_openness) || 0}</h5>

        <Bar 
        data={{
      labels: ['Actual Agreeableness', 
      'Difference Agreeableness',
      'Predicted Agreeableness', 
      'Actual Conscientiousness', 
      'Difference Conscientiousness', 
      'Predicted Conscientiousness',
      'Actual Emotional Stability', 
      'Difference Emotional Stability', 
      'Predicted Emotional Stability',
      'Actual Extraversion', 
      'Difference Extraversion', 
      'Predicted Extraversion',
      'Actual Openness', 
      'Difference Openness', 
      'Predicted Openness'
    ],
      datasets: [
        {
            backgroundColor: [
                'rgba(255, 159, 64)',
                'rgba(54, 162, 235)',
                'rgba(153, 102, 255)'
              ],
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          label:"",
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: barItems2
        }
      ]
    }} />
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
