const DPU = require('../models/dataPerUser');
const axios = require('axios').default;
const Friends =  require('../models/friendsData')


exports.firstPage = (req, res) =>{
    res.render('index', {title: 'MovieList: Discover, share and track your movies and serials with MovieList'})
}
exports.homePage = async(req, res, next) =>{
    try{
        const friendsData  = await Friends.find({username: req.user.username});
        let usersArray = [`${req.user.username}`];
        friendsData.forEach((data) =>{
            data.friends.forEach(friend => usersArray.push(friend));
        })
        const newDPU = await DPU.find({
            username: { $in: usersArray}
        })
        .sort({time : -1})
        .limit(10)
        res.render('homepage', {title: 'Homepage', newDPU})
    }catch(error){
        next(error);
    }
}
exports.profilePage = async(req, res, next) =>{
    try{
        const newDPU = await DPU
        .find({username: req.params.userName})
        .sort({time : -1})
        .limit(10)
        const userPage = req.params.userName;
        // const parsedData = JSON.parse(JSON.stringify(newDPU));
        res.render('profilepage', {title: `${userPage}`, newDPU, userPage});
    }catch(error){
        next(error);
    }
}
exports.addFriend = async(req, res, next) =>{
    try{
        const friendData = await Friends.findOneAndUpdate(
            {username: req.user.username}, 
            { $push: { friends: req.params.userName}}, 
            {new:true});
        
        res.redirect(`/user/${req.params.userName}`);
    }catch(error){
        next(error);
    }
}

exports.dataToDPU = async(req, res, next) =>{
    try{
        const parsedData = res.locals.myData;
        const dataQuery = req.body;
        const dataDPU = new DPU();
        dataDPU.username = req.user.username;
        dataDPU.movieId = req.params.imdbID;
        dataDPU.titlename = parsedData.Title;
        dataDPU.titleimage = parsedData.Poster;
        if(parsedData.Type === 'movie') dataDPU.titleType = 'movie';
        else dataDPU.titleType = 'series';
        dataDPU.status = dataQuery.Status;
        dataDPU.my_rating = dataQuery.score;
        await dataDPU.save();
        res.redirect(`/movie/${req.params.imdbID}`);
//        dataDPU.favorite = dataQuery.
    }catch(error){ 
        next(error);
    }
}
exports.searchMovieGet = (req, res) =>{ 
    var type;
   if(req.query.movieOrTv === '2'){
        type='series';
    }
    else{
        type = 'movie';
    }
    var page = 1;
    if(req.query.search){
        const title = req.query.search;
        // thisData = searchFor(title, page, type);
        // res.send(thisData);
        var options = {
            method: 'GET',
            url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
            params: {s: title, page: `${page}`, type: type, r: 'json'},
            headers: {
                'x-rapidapi-key': '3080e92226msh8ff2abc3225fff0p1acd7ejsn2e473d7713c9',
                'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com'
            }
            };
        
            axios.request(options).then( (response) => {
                try{
                    const preParsedData = JSON.parse(JSON.stringify(response.data));
                    const parsedData = JSON.parse(JSON.stringify(preParsedData.Search));
                    res.render('search', {title: 'Search', parsedData})
                }catch{
                    var cantFind = `Sorry we could not find ${title}`;
                    res.render('search', {title: 'Search', cantFind})    
                }
            }).catch((error) =>{
                console.error(error);
            })
    }else{
        res.render('search', {title: "Search"})
    }
}

exports.apiSearch = (req, res, next) =>{
    const movieId = req.params.imdbID;
    const options = {
        method: 'GET',
        url: 'https://movie-database-imdb-alternative.p.rapidapi.com/',
        params: {i: movieId, r: 'json'},
        headers: {
          'x-rapidapi-key': '3080e92226msh8ff2abc3225fff0p1acd7ejsn2e473d7713c9',
          'x-rapidapi-host': 'movie-database-imdb-alternative.p.rapidapi.com'
        }
      }
    axios.request(options)
    .then(function (response) {
        const newData = JSON.stringify(response.data);
        const parsedData = JSON.parse(newData);
        res.locals.myData = parsedData;
        next();
    }).catch(function (error) {
        console.error(error);
    });
}

exports.mvtvPage = (req, res) => {  
    const parsedData = res.locals.myData;
    res.render('movieTV', {title: `${parsedData.Title}`, parsedData})   
}

//MV AND TV PAGES:
exports.movieListPage = async(req, res, next)=>{
    try{
        var type;
        if(req.params.list === 'movielist') type='movie'
        else type='series'
        const parsedData = await DPU
        .find({ username: req.params.userName,titleType: type})
        .sort(
            {status: 1, my_rating: -1}
        );
        res.render('listpage', {title: `${req.params.userName}'s ${type}List`, parsedData})
    }catch(error){
        next(error);
    }
}

exports.socialPage = async(req, res, next) => {
    try{
        const userData = await Friends.find({username: req.params.userName});
        res.render('social', {title: `${req.params.userName}'s profile: Social`, userData})
    }catch(error){
        next(error);
    }
}
