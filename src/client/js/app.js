/*
    ~baseURL leads to the api link and will access the info via a zipcode
    ~apiKey is used as verification to obtain the data
    ~date gets the date in the normal format of (Month, Day, Year GMT)
    ~Current Date will use date methods to obtain the number values from
    the date
*/
let baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
let apiKey = "&appid=683ab2ba4e65e8846a80c2c2e5a7e2fd";
const date = new Date();
const currentDate = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

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
    const userZipcode = document.getElementById('zip').value;
    const userComment = document.getElementById('feelings').value;
    getTemp(baseURL, userZipcode, apiKey)

    .then(function(data){
        postData('http://locahost:3000/all', {date:currentDate, temp:data.main.temp, comment: userComment});
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
const getTemp = async(url, zip, key)=>{
    const res = await fetch(url+zip+key);
    try{
        const data = await res.json();
        return data;
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
    const request = await fetch('http://locahost:3000/add');
    try{
        const allData = await request.json();
        let unitConversion = ((allData.temp * 9)/5)-459.67;
        document.getElementById('date').innerHTML = `Date of Post: ${allData.date}`;
        document.getElementById('temp').innerHTML = `Temperateur from your Zip: ${unitConversion.toFixed(0)} F°`;
        document.getElementById('content').innerHTML = `Your Thoughts of the day: ${allData.comment}`;
    }
    catch(error){
        console.log(`Error: ${error}`);
    }
}

export { performAction } 