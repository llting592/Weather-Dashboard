var cityInputForm = document.querySelector("#city-search");
var cityInput= document.querySelector("#city");
var searchedCityInput = document.querySelector("#searched-city");
var weatherForecast = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveday-forecast-container");
var pastSearchBtn = document.querySelector("#past-search-btn");
var currentWeather = document.querySelector("#current-weather-container");
var apiKey = "818583db1cb8276b10072d87158aa95a";
var cities = [];

//fetch data from API
var getWeather = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

//display weather- create spans to display temp, wind, humidity and set icons

var displayWeather = function (weather, userInput){
    userInput = searchedCityInput.textContent;
    currentWeather.textContent="";

    var currentDate = document.createElement("span");
    currentDate.textContent= " (" + moment(weather.dt.value).format("D MMM, YYYY") + ") ";
    searchedCityInput.appendChild(currentDate);

    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    searchedCityInput.appendChild(weatherIcon);

    var temp = document.createElement("span");
    temp.textContent = "Temp: " + weather.main.temp  + " F";
    temp.classList = "list-group-item";

    var windSpeed= document.createElement("span");
    windSpeed.textContent = "Wind: " + weather.wind.speed + " MPH";
    windSpeed.classList = "list-group-item";

    var humidity = document.createElement("span");
    humidity.textContent = "Humidity: " + weather.main.humidity + " %";
    humidity.classList = "list-group-item";

    currentWeather.appendChild(temp);
    currentWeather.appendChild(windSpeed);
    currentWeather.appendChild(humidity);

};

//fetch five day forecast from api
var getFiveDayForecast = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayFiveDay(data, city);
        });
    });
};

//display five day forecast
var get5Day = function(city){
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
           display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainer.textContent = ""
    weatherForecast.textContent = "5-Day Forecast:";
    var forecast = weather.list;
        for(var i=5; i < forecast.length; i=i+8){

       var dailyForecast = forecast[i];

       var forecastEl=document.createElement("div");
       forecastEl.classList = "card bg-primary text-light m-2";

       var forecastDate = document.createElement("h5")
       forecastDate.textContent= moment.unix(dailyForecast.dt).format("D MMM, YYYY");
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
    pastSearchEl.setAttribute("city-data", pastSearch);
    pastSearchEl.setAttribute("type", "submit");
    pastSearchBtn.prepend(pastSearchEl);
}

var pastSearchHandler = function(event){
    var city = event.target.getAttribute("city-data")
    if (city){
        getWeather(city);
        getFiveDayForecast(city);
    }
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
}

var formsSubmitHandler = function(event){
    event.preventDefault();
    var city = cityInput.value.trim();
    if(city){
        getWeather(city);
        getFiveDayForecast(city);
        cities.unshift({city});
        cityInput.value = "";
    } else{
        alert("Please enter a City Name!");
    }
    saveSearch();
    pastSearch(city);
}

cityInputForm,addEventListener("submit", formsSubmitHandler);
pastSearchBtn.addEventListener("click", pastSearchHandler);