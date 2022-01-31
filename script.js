var apiKey = "{818583db1cb8276b10072d87158aa95a}";
var today = moment().format('L');
var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=";

//city search- function(s) for current and future conditions for that city and add it to search history
function currentWeather(city){
    var apiURL = queryURL + city + apiKey;
    fetch(apiURL)
    .then(function(response){
        return response.json() })
    .then(function(data){
        console.log(data);
    });
}
window.onload = function(){
    currentWeather ('New York');
}
//view UV index- presented with a color that indicates whether the conditions are favorable, moderate, or severe

//click on a city in search history- given the current and future conditions for that city
