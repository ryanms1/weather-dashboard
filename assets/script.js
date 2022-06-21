const city = document.getElementById('city')
const search = document.getElementById('searchCity')
const apiKey = "a60884f374b19d43c9e55bba9a3df14e"
const fiveHeader = document.getElementById('fiveHeader')
const searchedCities = document.getElementById('searchedCities')
const cityName = document.getElementById('cityName')
const weatherInfo = document.getElementById('weatherInfo')
const fiveDay = document.getElementById('fiveDay')

// localStorage.removeItem('cities')


// gets initial city info like lat and long in order to get more info in next fetch function
function getCity(enteredCity) {
    const weatherAPI = "http://api.openweathermap.org/geo/1.0/direct?q=" + enteredCity + "&appid=" + apiKey

    fetch(weatherAPI)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            getWeather(data)
        })
    // const today = new Date()
    // const tomorrow = new Date(today)
    // tomorrow.setDate(tomorrow.getDate() + 1)
    // console.log(tomorrow)
    checkHistory(enteredCity)
}

search.addEventListener('click', () => getCity(city.value))


//retrieves present day and 5 day forecast info and appends info to page
function getWeather(cityResults) {
    fiveDay.innerHTML = ''
    weatherInfo.innerHTML = ''
    cityName.innerHTML = cityResults[0].name + " " + new Date().toLocaleDateString()
    const lat = cityResults[0].lat
    const lon = cityResults[0].lon

    cityWeatherAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly&units=imperial&appid=" + apiKey


    fetch(cityWeatherAPI)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {

            const temp = document.createElement('li')
            const wind = document.createElement('li')
            const humidity = document.createElement('li')
            const uv = document.createElement('li')

            const icon = document.createElement('img')
            icon.src = "http://openweathermap.org/img/wn/" + data.daily[0].weather[0].icon + ".png"

            cityName.append(icon)

            fiveHeader.innerHTML = '5-Day Forecast:'
            temp.innerHTML = "Temp: " + data.current.temp + " &#8457"
            wind.innerHTML = "Wind: " + data.current.wind_speed + " MPH"
            humidity.innerHTML = "Humidity: " + data.current.humidity + "%"
            uv.innerHTML = "UV Index: " + data.current.uvi

            weatherInfo.append(temp, wind, humidity, uv)

            for (i = 1; i < 6; i++) {

                const weather = document.createElement('ul')
                const date = document.createElement('li')
                const icon = document.createElement('img')
                const temp = document.createElement('li')
                const wind = document.createElement('li')
                const humidity = document.createElement('li')


                const currentDate = new Date(data.daily[i].dt * 1000)
                date.innerText = currentDate.toLocaleDateString()
                console.log(date)

                icon.src = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png"
                temp.innerHTML = "Temp: " + data.daily[i].temp.day + " &#8457"
                wind.innerHTML = "Wind: " + data.daily[i].wind_speed + " MPH"
                humidity.innerHTML = "Humidity: " + data.daily[i].humidity + "%"

                weather.append(date, icon, temp, wind, humidity)

                fiveDay.appendChild(weather)
            }
        })

}


//stores search history for new cities only
function storeSearched(enteredCity) {
    const cityHistory = localStorage.getItem("cities")
    var history
    if (cityHistory === null) {
        var history = []
        history.push(enteredCity)
    }
    else {
        history = JSON.parse(cityHistory)

        alreadySaved = false
        for (i = 0; i < history.length; i++) {
            if (enteredCity === history[i]) {
                alreadySaved = true
            }
        }

        if (alreadySaved === false) {
            history.push(enteredCity)
        }
    }


    localStorage.setItem("cities", JSON.stringify(history))

    displayHistory()
}


//display search history and makes each city an event listenter to show information for clicked city 
function displayHistory() {
    searchedCities.innerHTML = ''
    const cityHistory = localStorage.getItem("cities")
    const history = JSON.parse(cityHistory)


    for (i = 0; i < history.length; i++) {
        const searchedCity = document.createElement('li')
        searchedCity.innerHTML = history[i]
        searchedCity.classList.add('history')

        searchedCities.append(searchedCity)

        searchedCity.addEventListener('click', () => getCity(searchedCity.innerText))
    }
}

// keeps city history at a max of 10 taking off the oldest when limit is reached to add the newest
function checkHistory(enteredCity) {
    const cityHistory = localStorage.getItem('cities')
    const history = JSON.parse(cityHistory)

    if (cityHistory === null) {
        storeSearched(enteredCity)
    }
    else if (history.length > 9) {
        history.shift()
        localStorage.setItem('cities', JSON.stringify(history))
        storeSearched(enteredCity)
    } else {
        storeSearched(enteredCity)
    }
}