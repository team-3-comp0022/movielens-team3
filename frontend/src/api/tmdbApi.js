import axiosClient from "./axiosClient";

export const category = {
    movie: 'movie'
}

export const movieType = {
    upcoming: 'upcoming',
    popular: 'popular',
    top_rated: 'top_rated',
    latest: 'latest'
}

export const tvType = {
    popular: 'popular',
    top_rated: 'top_rated',
    on_the_air: 'on_the_air'
}

export async function getMoviesFromDB(list_of_ids,params, callback) {
   return callback(tmdbApi.getMoviesFromOurDatabase(list_of_ids,params));
}

const tmdbApi = {
    getMoviesList: (type, params) => {
        const url = 'movie/' + movieType[type];
        return axiosClient.get(url, params);
       
    },
    getMoviesFromOurDatabase: (list_of_ids,params) => {
        //let res = await axios.get('http://localhost:3001/findMovieIds');
        // let data = res.data;
        // console.log("fml");
        // // for (var i = 0; i < 10; i++)
        //      console.log(data[i].imdbId);
        // for (var i = 0; i < 10; i++){
        //      tailoredUrl = 'find/' + data[i].imdbId+ '?api_key=1a438c34cc51e3bef8fc7e078fa986fc&language=en-US&external_source=imdb_id';
        //      console.log(tailoredUrl);
        //      all_urls.push(tailoredUrl);
        //     }
        //     console.log(all_urls);
        // }
        //makeGetRequest();
        var my_list = [];
        for (var i = 0; i < list_of_ids.length; i++){ // render 20 movies each time
           var my_id = list_of_ids[i].imdbId; 
           const url = 'find/' + 'tt0'+ my_id;
           //console.log(url);
           const tailoredUrl = "https://api.themoviedb.org/3/"+ url +'?api_key=1a438c34cc51e3bef8fc7e078fa986fc&external_source=imdb_id';
           //console.log(tailoredUrl);
           my_list.push(axiosClient.get(tailoredUrl,params));
        }
        return my_list;
    },

    getVideos: (cate, id) => {
        const url = category[cate] + '/' + id + '/videos';
        return axiosClient.get(url, {params: {}});
    },
    search: (cate, params) => {
        const url = 'search/' + category[cate];

        axiosClient.get("http://localhost:3001/search",params).then((response) => {
            //RESPONSE IS THE IDS
        })
        return axiosClient.get(url, params);
    },
    //TODO: Change this method
    getMovieInfo: (cate, id, params) => {
        const url = 'search/' + category[cate];

        axiosClient.get("http://localhost:3001/getMovieInfo", id, params).then((response) => {
            //RESPONSE IS THE IDS
        });
        //return axiosClient.get(url, params);
        const details = {genre:"Action", rating:"5"};
        return details;
    },
    detail: (cate, id, params) => {
        const url = category[cate] + '/' + id;
        return axiosClient.get(url, params);
    },
    credits: (cate, id) => {
        const url = category[cate] + '/' + id + '/credits';
        return axiosClient.get(url, {params: {}});
    },
    similar: (cate, id) => {
        const url = category[cate] + '/' + id + '/similar';
        return axiosClient.get(url, {params: {}});
    },
}

export default tmdbApi;