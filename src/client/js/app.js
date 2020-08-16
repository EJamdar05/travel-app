/*
    ~baseURL leads to the api link and will access the info via a zipcode
    ~apiKey is used as verification to obtain the data
    ~date gets the date in the normal format of (Month, Day, Year GMT)
    ~Current Date will use date methods to obtain the number values from
    the date
*/
let apiURL = "https://api.weatherbit.io/v2.0/current?"
let apiKey = "c949c4d2c7704425847115a98f583bf6";
const date = new Date();
const currentDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
console.log(currentDate);
/*
    ~an event listener is added to the generate button that will
    get the users input (zipcode and comment)
    ~then the async function getTemp is called with the 
    parameters needed to obtain the temperature
    ~then a promise function is called with the data parameter
    ~the postData then sends the data obtained from both the
    API and the user to the server and then addPost is called 
*/

document.getElementById('generate').addEventListener('click', performAction);

function performAction(event){
    const userCity = document.getElementById('zip').value;
    const userDate = document.getElementById('feelings').value;
    const numOfDays = getRemainingDays(userDate);
    const baseURL = `http://api.geonames.org/searchJSON?formatted=true&q=${userCity}&username=IssacJones2009&style=full`;
    getTemp(baseURL)

    .then(function(data){
        const lat = data.geonames[0].lat;
        const long = data.geonames[0].lng;
        const weatherURL = `${apiURL}&lat=${lat}&lon=${long}&key=${apiKey}`;
        const weather = getWeather(weatherURL);
        console.log(weather)
        postData('http://localhost:3000/add', {latitude: data.geonames[0].lat, longitude: data.geonames[0].lng, 
                                              country: data.geonames[0].countryName, date: numOfDays,
                                            temp: weather});
        addPost();
    });
}

/*
    ~getTemp will get the temp. based of the WeatherAPI 
    from openWeather
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

function  getRemainingDays(userDate){
    const presentDate = new Date(currentDate);
    const tripDate = new Date(userDate);

    const timeInterval = Math.abs(tripDate - presentDate); //absolute value
    const daysUntilTrip = Math.ceil(timeInterval / (1000 * 60 * 60 * 24));
    console.log(daysUntilTrip);
    return daysUntilTrip;

}

const getWeather = async(url)=>{
    const res = await fetch(url);
    try{
        const weatherData = await res.json();
        console.log(weatherData.data[0].temp);
        return weatherData.data[0].temp;
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
const addPost = async()=>{
    const request = await fetch('http://localhost:3000/all');
    try{
        const allData = await request.json();
        var test = JSON.stringify(allData.temp);
        document.getElementById('date').innerHTML = `Country: ${allData.country}`;
        document.getElementById('temp').innerHTML = `Longitude: ${allData.longitude}`;
        document.getElementById('content').innerHTML = `Latitude: ${allData.latitude}`;
        document.getElementById('days').innerHTML = `Days Remaining: ${allData.date}`;
        document.getElementById('weather').innerHTML = `Temp: ${test}`;
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
}

export { performAction } 