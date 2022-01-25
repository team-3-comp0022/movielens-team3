const apiConfig = {
    baseUrl: 'https://api.themoviedb.org/3/',
    apiKey: '1a438c34cc51e3bef8fc7e078fa986fc',
    originalImage: (imgPath) => `https://image.tmdb.org/t/p/original/${imgPath}`,
    w500Image: (imgPath) => `https://image.tmdb.org/t/p/w500/${imgPath}`
}

export default apiConfig;