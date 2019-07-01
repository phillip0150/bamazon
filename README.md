# bamazon

Wish you could do your amazon shopping on the Command Line? Well now you can with bamazon! 


[Link to app](https://github.com/phillip0150/bamazon)

## Technologies

bamazon was written with `javascript`, `node.js`, `mysql`, `inquirer`, `dotenv`.



## How to use

### Challenge 1
[Video of app in action (google drive link)](https://drive.google.com/file/d/1Glp6JPhKHKMyvj-3-RLevV9trhKNIyOy/view)


You will need to install inquirer, dotenv, and mysql packages in the same folder as your program.

```bash
  npm install mysql
  npm install inquirer
  npm install dotenv
```

To run the program, you need to open your computer's terminal and enter the follow command:

```bash
  node bamazonCustomer.js
```
![screenShot](https://github.com/phillip0150/bamazon/blob/master/images/1.png?raw=true)

From there, you are presented with a list of items from bamazon.

### Buying on bamazon

To buy an item, type in the correct product ID:
```bash
  ? Please slected the ID number of the item you would like to purchase 4
```

![screenShot](https://github.com/phillip0150/LIRI/blob/master/images/3.png?raw=true)

Once you enter a product ID, you are asked to enter the amount you want to purchase:
```bash
  ? Please slected the ID number of the item you would like to purchase 4
  ? How much would you like? 20
```



### Error handling

#### Product ID#

If the user doesn't enter a song name, the program defaults to "The Sign"

```bash
  node liri.js spotify-this-song
```

![screenShot](https://github.com/phillip0150/LIRI/blob/master/images/7.png?raw=true)

If the program cannot find a song, it will display a message

```text
  node liri.js spotify-this-song fjkdls;ajfkdls;a
  Sorry, no results. Please search another song.
```

#### Quantity

If the user doesn't enter a artist, the program defaults to "Lil Pump"

```bash
  node liri.js concert-this
```

![screenShot](https://github.com/phillip0150/LIRI/blob/master/images/8.png?raw=true)

If the program cannot find a concert, it will display a message

```text
  node liri.js concert-this Taylor Swift
  Sorry, no concert for Taylor Swift
```


## Organization

### Functions

#### Spotify Function
```javascript
    //Spotify Function
    function spotifySearch(song){
    //if the user doesn't enter a song, we assign song as "The Sign"
    if (song === ""){
        song = "The Sign";
    }
    //setting up the search
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        //if this is 0, we know that we coudln't find a song
        if(data.tracks.items.length === 0){
            console.log("Sorry, no results. Please search another song.");
        }
        //for loop to display all the songs found
        for (var i = 0; i<  data.tracks.items.length; i++){
            console.log("-------------------------");
            console.log("Artist: " + data.tracks.items[i].artists[0].name);
            console.log("Song name: " + data.tracks.items[i].name);
            console.log("Link: " + data.tracks.items[i].external_urls.spotify);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("-------------------------");
        } 
    });
}
```

#### Movie Function

```javascript
    //movie-this function
    function movie(movieName) {
        //if the user enters a blank movie, we set movie to Mr. Nobody
        if (movieName === ""){
            movieName = "Mr. Nobody";
        }
        // Then run a request with axios to the OMDB API with the movie specified
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl).then(
            function(response) {
                //if response length is 0, we didn't get a result
                if(response.data.length === 0){
                    console.log("Sorry, no results. Please search another movie.");
                }
                //displaying movie info
                console.log("------------------------------");
                console.log(`Title: ${response.data.Title}`);// * Title of the movie.
                console.log(`Released: ${response.data.Released}`);//* Year the movie came out.
                console.log(`IMDB Rating: ${response.data.imdbRating}`);//* IMDB Rating of the movie.
                console.log(`Rotten Tomatoes Rating: ${response.data.Ratings[1].Value}`);//* Rotten Tomatoes Rating of the movie.
                console.log(`Country where it was produced: ${response.data.Country}`);//* Country where the movie was produced.
                console.log(`Movie language: ${response.data.Language}`);//* Language of the movie.
                console.log(`Plot: ${response.data.Plot}`);//* Plot of the movie.
                console.log(`Actors: ${response.data.Actors}`);//* Actors in the movie.
                console.log("------------------------------");
            })
            .catch(function(error) {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("---------------Data---------------");
                    console.log(error.response.data);
                    console.log("---------------Status---------------");
                    console.log(error.response.status);
                    console.log("---------------Status---------------");
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an object that comes back with details pertaining to the error that occurred.
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error", error.message);
                }
                console.log(error.config);
        });
    }
```

#### Concert Function

```javascript
    //concert-this function
    function concert(artist){
      //if the artist is blank, user didn't enter anything
      //set artist to "Lil Pump"
      if (artist === ""){
          artist = "Lil Pump";
      }
      //setting the query
      var queryUrl = "https://rest.bandsintown.com/artists/" + artist.trim() + "/events?app_id=codingbootcamp";
      //using axios to get repsonse
      axios.get(queryUrl).then(
          function(response) {
              //if response lenght is 0, we know that the artist doesn't have a concert coming up
              if(response.data.length === 0){
                  return console.log("Sorry, no concert for " +artist.trim());
              }
              //console.log the artist name
              //then for loop to display all info
              console.log(artist.trim() + " concert list");
              for (var i =0; i< response.data.length; i++)
              {
                  console.log("------------------------------");
                  console.log(`Artist: ${artist}`);
                  console.log(`Venue Name: ${response.data[i].venue.name}`);
                  console.log(`Venue Location: ${response.data[i].venue.city}, ${response.data[i].venue.country}`);
                  console.log(`Date of Event: ${moment(response.data[i].datetime).format("L")}`);
                  console.log("------------------------------");
              } 
          })
      .catch(function(error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log("---------------Data---------------");
              console.log(error.response.data);
              console.log("---------------Status---------------");
              console.log(error.response.status);
              console.log("---------------Status---------------");
              console.log(error.response.headers);
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an object that comes back with details pertaining to the error that occurred.
              console.log(error.request);
          } else {
              // Something happened in setting up the request that triggered an Error
              console.log("Error", error.message);
          }
          console.log(error.config);
      });
  }
```

#### Do What It Says Function
The doWhat Function reads the file, then puts all the text in the array
We look through the array and run the commands.
Once we found the correct command, we run their function
``` javascript
function doWhat(){
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
          return console.log(error);
        }
      
        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");
        
      
        // We will then re-display the content as an array for later use.
        for (var i =0; i<dataArr.length-1; i++){
            switch(dataArr[i]){
                case "spotify-this-song":
                    spotifySearch(dataArr[i+1]);
                    break;
                case "concert-this":
                    concert(dataArr[i+1]);
                    break;
                case "movie-this":
                    movie(dataArr[i+1]);
                    break;
                // default:
                //     console.log("Sorry, file is corrupt. Please make sure file has a format of [command],[argument].")

            }
        }
      
      });
}
```

### Switch Statment

I used a swtich statment to call the correct function based on the command the user entered

``` javascript
    //switch case to see what the userInput is
    //then calling the correct function
    switch (userInput) {
        case "spotify-this-song":
            spotifySearch(process.argv.slice(3).join(" ")); 
            break;
        case "concert-this":
            concert(process.argv.slice(3).join(" "));
            break;
        case "movie-this":
            movie(process.argv.slice(3).join(" "));
            break;
        case "do-what-it-says":
            doWhat();
            break;
        default:
            console.log("-------------------------");
            console.log("Please use spotify-this-song <input>, to search a song\nPlease use concert-this <input>, to search a concert\nPlease use moive-this <input>, to search a movie\nPlease use do-what-it-says to use a text file to search for you.")
            console.log("-------------------------");
    }
```

## My role
Application developer

