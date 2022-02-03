//set global variables 
var cityFormInput=document.querySelector("#city-search");
var cityInput=document.querySelector("#city");
var weatherContainer=document.querySelector("#current-weather-container");
var citySearchInput = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveday-forecast-container");
var pastSearchBtn = document.querySelector("#past-search-btn");
var apiKey = "818583db1cb8276b10072d87158aa95a"
var cities = [];

//fetch current city weather data from API
var getCityWeather = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data);
        });
    });
};

//display data (temp, wind, humidity) pulled
var displayWeather = function(weather, searchCity){
   weatherContainer.textContent= "";  
   citySearchInput.textContent=searchCity;
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);
  
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInput.appendChild(weatherIcon);
  
   var temp = document.createElement("span");
   temp.textContent = "Temperature: " + (weather.main.temp) + " °F";
   temp.classList = "list-group-item"

   var windSpeed = document.createElement("span");
   windSpeed.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeed.classList = "list-group-item"
   
  
   var humidity = document.createElement("span");
   humidity.textContent = "Humidity: " + weather.main.humidity + " %";
   humidity.classList = "list-group-item"
   
  
   weatherContainer.appendChild(temp);
   
   weatherContainer.appendChild(humidity);
   
   weatherContainer.appendChild(windSpeed);
   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
}

//note- planned to add UV index function here and add the favorable, moderate and severe classes to change colors, but currently could not get the information from the API to fetch properly



//fetch five day forecast from API
var getFiveDayForecast = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)

    .then(function(response){
        response.json().then(function(data){
           displayFiveDayForecast(data);
        });
    });
};
//display five day forecast data pulled
var displayFiveDayForecast = function(weather){

    forecastContainer.textContent = ""

    forecastTitle.textContent = "5-Day Forecast:";
    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];

       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-3";

       var forecastDate = document.createElement("h3")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastEl.appendChild(weatherIcon);

       var forecastTemp=document.createElement("span");
       forecastTemp.classList = "card-body text-center";
       forecastTemp.textContent = "Temp: " + dailyForecast.main.temp + " °F";
       forecastEl.appendChild(forecastTemp);

       var forecastWind=document.createElement("span");
       forecastWind.classList = "card-body text-center";
       forecastWind.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
       forecastEl.appendChild(forecastWind);

       var forecastHumidity=document.createElement("span");
       forecastHumidity.classList = "card-body text-center";
       forecastHumidity.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHumidity);
       
       forecastContainer.appendChild(forecastEl);
    }
}
// to be able to have working buttons and click past cities
var pastSearch = function(pastSearch){
    var pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-80 btn-light border p-2";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchBtn.prepend(pastSearchEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        getFiveDayForecast(city);
    }
}

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        getFiveDayForecast(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Please enter a city name!");
    }
    saveSearch();
    pastSearch(city);
}
var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};

cityFormInput.addEventListener("submit", formSumbitHandler);
pastSearchBtn.addEventListener("click", pastSearchHandler);