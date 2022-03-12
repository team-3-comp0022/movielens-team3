import axiosClient from "./axiosClient";

export const category = {
    movie: 'movie',
    popular: 'popular',
    polarising: 'polarising',
    pickGenre: 'pickGenre'
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

const tmdbApi = {
    getMoviesList: (type, params) => {
        const url = 'movie/' + movieType[type];
        return axiosClient.get(url, params);
       
    },
    getMoviesFromOurDatabase: (list_of_ids,params) => {
        var my_list = [];
        for (var i = 0; i < list_of_ids.length; i++){ // render 20 movies each time
           var my_id = list_of_ids[i].imdbId; 
           const url = 'find/' + 'tt'+ my_id;
           //console.log(url);
           const tailoredUrl = "https://api.themoviedb.org/3/"+ url +'?api_key=1a438c34cc51e3bef8fc7e078fa986fc&external_source=imdb_id';
         // console.log(tailoredUrl);
           my_list.push(axiosClient.get(tailoredUrl,params));
        }
        return my_list;
    },

    getVideos: (cate, id) => {
        const url = category[cate] + '/' + id + '/videos';
        return axiosClient.get(url, {params: {}});
    },
    search: (params) => {
        console.log("intra in search");
        console.log(params);
        axiosClient.get("http://localhost:3001/search", params).then((response) => { 
            console.log("lallala", response);
            return response;
        })

    },

    getListOfGenres: (params) => {
        console.log("intra in genre");
        console.log(params);
        axiosClient.get("http://localhost:3001/getGenre", params).then((response) => { 
            console.log("lallala", response);
            return response;
        })
    },
    //TODO: Change this method
    getMovieInfo: (id, params) => {
        var res = [];
        axiosClient.get("http://localhost:3001/secondQuery?query="+id, params).then((response) => {
            //RESPONSE IS THE IDS
            console.log("Hey")
            console.log(response);
            res = response;
            return response;
        });
        return res;
    },
    detail: (cate, id, params) => {
        const url =  'movie/' + id;
        return axiosClient.get(url, params);
    },
    credits: (cate, id) => {
        const url = 'movie/' + id + '/credits';
        return axiosClient.get(url, {params: {}});
    },
    similar: (cate, id) => {
        const url ='movie/' + id + '/similar';
        return axiosClient.get(url, {params: {}});
    },
}

export default tmdbApi;