const cityEl = document.querySelector("#city");
const form = document.querySelector("form");
const input = document.querySelector("input");
const list  = document.querySelector("#list");
const dateEl = document.querySelector("#date");
const prevSearches = document.querySelector("#prevSearches")
const forecast = document.querySelector("#forecast");

var loadedList = localStorage.getItem("list");
console.log(loadedList);
prevSearches.innerHTML = loadedList;

form.addEventListener("submit", function(event) {
    event.preventDefault();
    var apiKey = "91046781fbed9e003d3e2a7bd33ced99";
    var inputVal = input.value;
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=imperial`;

    todaysDate = moment().format("MMM Do YYYY")

    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const { main, name, sys, weather, wind, coord } = data;
        const icon = `https://openweathermap.org/img/wn/${
        weather[0]["icon"]
        }@2x.png`;
        
        const p = document.createElement("p");
        p.classList.add("city");
        const markup = `
        <div class="card column" id="today">
        <ul id="weatherDisplay">
        
        <div class="card-header">
        <h2 class="city-name" data-name="${name},${sys.country}">
            <span>${name}</span>
            <sup>${sys.country}</sup>
        </h2>
        </div>
        <div class="card-content" id="todayContent">
        <div class="content">
        <div class="city-temp">temp: ${Math.round(main.temp)}<sup>°F</sup></div>
        <div class="conditions"></div>
        humidity: ${main.humidity}
        wind speed: ${wind.speed} 
        </div>
        <div class="card-image">
        <figure>
            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
            <figcaption><sub>${weather[0]["description"]}</sub></figcaption>
        </figure>
        </div>
        </div>
        </div>
        `;
        p.innerHTML = markup;
        forecast.innerHTML = "";
        forecast.appendChild(p);

        var li = document.createElement("li");
        var limarkup = ` ${name}, ${sys.country}`
        li.textContent = limarkup;
        prevSearches.appendChild(li);
        console.log(prevSearches.innerHTML);
        localStorage.setItem("list", prevSearches.innerHTML)
        var lon = coord.lon;
        var lat = coord.lat;
        var url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const {value} = data;
            var uv = document.createElement("p");
            uv.textContent = "UV index: " + value;
            todayContent.appendChild(uv);
            var url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=imperial`
        return fetch(url)
        .then(response => response.json())
        .then(data => {
                const {daily} = data;
                for (i=1; i < 6; i++) {
                    var day = daily[i];
                    var timestamp = day.dt;
                    var milliseconds = timestamp * 1000;
                    var dateObject = new Date(milliseconds);
                    var newDate = dateObject.toLocaleDateString()
                    var temp = day.temp.day;
                    var icon  = `https://openweathermap.org/img/wn/${
                        weather[0]["icon"]
                        }@2x.png`
                    var humid = day.humidity;
                    var thisDay = document.createElement("p");
                    var markup = `
                    <div class="card column">
                        <div class="card-image">
                            <figure>
                            <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
                            </figure>
                        </div>
                   
                    
                    <div class="card-content"> 
                    <div class="content">
                    <div>date: ${newDate}</div>
                    <div>temp: ${temp}<sup>F</sup></div>
                    <div>humidity: ${humid}</div>
                    </div>
                    </div>
                    </div>`
                    thisDay.innerHTML = markup;
                    forecast.appendChild(thisDay);

                }
            })
        })
        
    })
    .catch(() => {
        msg.textContent = "Please search for a valid city!";
    });
    msg.textContent = "";
    form.reset();
    input.focus();
    });
 
 
