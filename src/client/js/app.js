/*
    ~weatherAPIURL is the API for weatherBit
    ~APIKey is also for the weatherBit api
    ~date makes a new date from the current date
*/
let weatherAPIURL = "https://api.weatherbit.io/v2.0/current?" //weather
let weatherAPIKey = "c949c4d2c7704425847115a98f583bf6";
const date = new Date();
const currentDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;


/*
    ~userCity: will get the city the user wants to go to
    ~searchCity is for the pixelbay api to make sure that
    no spaces are present in the url
    ~userDate will get the date where the user will go on vacation
    ~userReturn will get the return date of the user from vacation
    ~numOfDays will call getRemaining days to determine how
    many days are left between the present and the planned vacation
    ~tripDays will determine how many days the user will be on vacation
    ~geoURL will get lat and long to determine the weather of the area
    ~data holds the geoCities API data
    ~picURL is for pixelbay
    ~weatherURL is to determine the weather and is from the weatherAPI (needs lat and long)
    ~weather has the weatherAPI data
    picture has the pictureURL
    ~post data contacts the server and uploads data from client
    ~addPost adds the data

*/

document.getElementById('generate').addEventListener('click', performAction);

async function performAction(event){
    const userCity = document.getElementById('zip').value;
    const searchCity= userCity.replace(/\s/g, '+');  
    const userDate = document.getElementById('feelings').value;
    const userReturn = document.getElementById('return').value;
    const numOfDays = getRemainingDays(userDate, currentDate);
    const tripDays = getRemainingDays(userDate, userReturn);
    
    let isProper = Client.checkForName(userCity);

    if (isProper == false){
        errorMessage();
    }

    const geoURL = `http://api.geonames.org/searchJSON?formatted=true&q=${searchCity}&username=IssacJones2009&style=full`;
    const data = await getTemp(geoURL);
    const lat = data.geonames[0].lat;
    const long = data.geonames[0].lng;

    const weatherURL = `${weatherAPIURL}&lat=${lat}&lon=${long}&key=${weatherAPIKey}`;
    const weather = await getWeather(weatherURL);

    const picURL = `https://pixabay.com/api/?key=17919793-601b009eefaa8f85cf73498ae&q=${userCity}&image_type=photo`;
    const picture = await getPicture(picURL);

    await postData('http://localhost:3000/add', {latitude: data.geonames[0].lat, longitude: data.geonames[0].lng, 
                                              country: data.geonames[0].countryName, date: numOfDays,
                                            temp: weather,image: picture });
    addPost(userCity, userDate, tripDays, userReturn);
}

/*
    ~getTemp will get the lat and long based off GeoCities
    ~res function will await and then try to access the API
    ~a try catch statement executes and if the fetch was successful,
        ~the data is then turned into text via json
        ~the data is then returned 
    ~if not successful, then the error is logged via the console
*/
const getTemp = async(url)=>{
    const res = await fetch(url);
    try{
        const data = await res.json();
        console.log(data);
        return data;
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
}
/*
    ~getRemainingDAys will get two dates and then determine the amount of days
    left between the two dates based off getting an abs value from the dates and
    doing a conversion to get the amount of days
*/
function  getRemainingDays(userDate, currentDate){
    const presentDate = new Date(currentDate);
    const tripDate = new Date(userDate);

    const timeInterval = Math.abs(tripDate - presentDate); //absolute value
    const daysUntilTrip = Math.ceil(timeInterval / (1000 * 60 * 60 * 24));
    return daysUntilTrip;

}
/*
    ~getWeather will get the actual temperatiure in Celsius and
    also the sky conditions based off lat and long from geoCitiesAPI
    . WeatherBitAPI is contacted here and returns a sentence
*/
const getWeather = async(url)=>{
    const res = await fetch(url);
    try{
        const weatherData = await res.json();
        console.log(weatherData.data[0].weather.description);
        const temper = weatherData.data[0].temp;
        const cond = weatherData.data[0].weather.description;
        return `${temper} Celcius with ${cond}.`;
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
}
/*
    ~getPicture will contact pixelbay and get an image based off the city provided
    by the user and will return a url
*/
const getPicture = async(url)=>{
    const res = await fetch(url);
    try{
        const pictureData = await res.json();
        return pictureData.hits[0].largeImageURL;
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
}
/*
    ~postData function will then communicate with the server file
    when called and send the data to the server to be organized
    ~after the boilerplate code, a try catch is handeled
    if the code does run, the newData is then returned

*/
const postData = async(url='', data={})=>{
    const response = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),        
      });

    try{
        const newData = await response.json();
        return newData;
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
};
/*
    ~addPost function will then try a get request for the data stored
    on the local server and if the data is recived,
     ~the data is then stored in allData
     ~a unitConversion from Kelvin to Fareheit is done
     ~then the data is sent over to the empty elementIDs and dynamically
     added
*/
const addPost = async(userCity, userDate, tripDays, userReturn)=>{
    const request = await fetch('http://localhost:3000/all');
    try{
        const allData = await request.json();
        document.getElementsByClassName("title")[0].innerHTML = "Most Recent Entry";
        document.getElementById('date').innerHTML = `<h2>Trip Summary</h2>
                                                    <img width="150" height="150" src="${allData.image}">`
        document.getElementById('text city').innerHTML = `<b>Destination:</b> ${userCity}, ${allData.country}`;
        document.getElementById('text departure').innerHTML = `<b>Todays Date:</b> ${currentDate}`;
        document.getElementById('text tripdate').innerHTML = `<b>Departure Date:</b> ${userDate}`;
        document.getElementById('text countdown').innerHTML = `<b>Days Remaining Until Trip:</b> ${allData.date}`;
        document.getElementById('text temp').innerHTML = `<b>Weather:</b> ${allData.temp}`;
        document.getElementById('text days').innerHTML = `<b>Duration of Trip:</b> ${userDate}-${userReturn}(${tripDays} Days)`;
        document.getElementsByClassName("results")[0].style.backgroundColor = "floralwhite";
        document.getElementsByClassName("results")[0].style.border = "5px dashed orange";
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
}

function errorMessage(){
    document.getElementById('text city').innerHTML = `<h2 style = "color: red; font-weight: bold;">ERROR: PLEASE ENTER A SENTENCE WITH NO NUMERICAL NUMBERS
    OR SPECIAL CHARS.`
}

export { performAction } 