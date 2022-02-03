var cityFormInput=document.querySelector("#city-search");
var cityInput=document.querySelector("#city");
var weatherContainer=document.querySelector("#current-weather-container");
var citySearchInput = document.querySelector("#searched-city");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveday-forecast-container");
var pastSearchBtn = document.querySelector("#past-search-btn");
var apiKey = "818583db1cb8276b10072d87158aa95a"
var cities = [];


var getCityWeather = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};
var displayWeather = function(weather, searchCity){
   weatherContainer.textContent= "";  
   citySearchInput.textContent=searchCity;
   var currentDate = document.createElement("span")
   currentDate.textContent=" (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
   citySearchInput.appendChild(currentDate);
  
   var weatherIcon = document.createElement("img")
   weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
   citySearchInput.appendChild(weatherIcon);
  
   var temperatureEl = document.createElement("span");
   temperatureEl.textContent = "Temperature: " + (weather.main.temp) + " °F";
   temperatureEl.classList = "list-group-item"

   var windSpeedEl = document.createElement("span");
   windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
   windSpeedEl.classList = "list-group-item"
   
  
   var humidityEl = document.createElement("span");
   humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
   humidityEl.classList = "list-group-item"
   
  
   weatherContainer.appendChild(temperatureEl);
   
   weatherContainer.appendChild(humidityEl);
   
   weatherContainer.appendChild(windSpeedEl);
   var lat = weather.coord.lat;
   var lon = weather.coord.lon;
}
var getFiveDayForecast = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           displayFiveDay(data);
        });
    });
};
//get five day forecast
var displayFiveDay = function(weather){

    forecastContainer.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";
    
    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){
       var dailyForecast = forecast[i];

       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       var forecastDate = document.createElement("h3")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("MMM D, YYYY");
       forecastDate.classList = "card-header text-center"
       forecastEl.appendChild(forecastDate);

       var weatherIcon = document.createElement("img")
       weatherIcon.classList = "card-body text-center";
       weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
       forecastEl.appendChild(weatherIcon);

       var forecastTempEl=document.createElement("span");
       forecastTempEl.classList = "card-body text-center";
       forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
       forecastEl.appendChild(forecastTempEl);

       var forecastWindEl=document.createElement("span");
       forecastWindEl.classList = "card-body text-center";
       forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
       forecastEl.appendChild(forecastWindEl);

       var forecastHumEl=document.createElement("span");
       forecastHumEl.classList = "card-body text-center";
       forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
       forecastEl.appendChild(forecastHumEl);
       
       forecastContainer.appendChild(forecastEl);
    }
}
var pastSearch = function(pastSearch){
    var pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-80 btn-light border p-3";
    pastSearchEl.setAttribute("data-city",pastSearch)
    pastSearchEl.setAttribute("type", "submit");
    pastSearchBtn.prepend(pastSearchEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
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