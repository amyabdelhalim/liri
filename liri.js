require('dotenv').config()
var axios = require("axios")
var moment = require("moment")
var Spotify = require("node-spotify-api")


var fs = require("fs")
var keys = require("./keys")
var spotify = new Spotify(keys.spotify);


var getArtistName = function (artist) {
  return artist.name
}
var getMeSpotify = function (songName) {
  if (songName === undefined) {
    songName = "Song not found"
  }
  spotify.search(
    {
      type: "track",
      query: songName,

    },
    function (error, data) {
      if (error) throw error
      var Songs = data.tracks.items

      var i;
      for (i = 0; i < Songs.length; i++) {
        console.log(i)
        // console.log("Artist" + Songs[i].artist.map(getArtistName))
        console.log("songName" + Songs[i].name)
        console.log("previewSong" + Songs[i].preview_url)
        console.log("album" + Songs[i].album.name)
        console.log("========")

      }
    }
  )
}
var getMyBands = function (artist) {
  var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=anyplaceholderwilldo"
  // + artist + "/event?app_id=codingbootcamp";
  axios.get(queryUrl)
    .then(function (response) {
      var jsonData = response.data

      if (!jsonData.length) {
        console.log("no results for this artist")
        return
      }
      console.log("upcoming concerts for" + artist)
      var i
      for (i = 0; i < jsonData.length; i++) {
        var show = jsonData[i]
        console.log(
          show.venue.city +
          "," +
          (show.venue.country || show.venue.region) +
          " at " +
          show.venue.name +
          " " +
          moment(show.datetime).format("mm/dd/yyyy")
        )
      }
    })
    .catch(e => {
      console.log(e);
    })
}
var getMovie = function (movie) {
  if (!movie) {
    movie = "Mr.Nobody"
  }
  var urlHit = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&apikey=trilogy";
  axios.get(urlHit).then(function (response) {
    var jsonData = response.data

    console.log("Title: " + jsonData.Title);
    console.log("Year: " + jsonData.Year);
    console.log("Rated: " + jsonData.Rated);
    console.log("IMDB Rating: " + jsonData.imdbRating);
    console.log("Country: " + jsonData.Country);
    console.log("Language: " + jsonData.Language);
    console.log("Plot: " + jsonData.Plot);
    console.log("Actors: " + jsonData.Actors);
    console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value)
  }
  )
}
var doWhatItSays = function () {
  fs.readFile("random.txt",'utf8',function(err, data) {
    if (err) throw err;
    console.log(data)
    var dataArray = data.split(",")
    if (dataArray.length === 2) {
      pick(dataArray[0], dataArray[1])
    }
    else if (dataArray.length === 1) {
      pick(dataArray[0])
    }
  })
}

var pick = function (caseData, functionData) {
  switch (caseData) {
    case "concert-this":
      getMyBands(functionData);
      break;
    case "spotify-this-song":
      getMeSpotify(functionData);
      break;
    case "movie-this":
      getMovie(functionData);
      break;
    case "do-what-it-says":
      doWhatItSays();
      break;
    default:
      console.log("LIRI doesn't know that");
  }
}
var runThis = function (one, two) {
  pick(one, two)
}


runThis(process.argv[2],process.argv.slice(3).join(" "));