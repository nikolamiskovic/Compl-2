const API_URL = "https://api.openweathermap.org/data/2.5/weather";

$(document).ready(function () {

    $("#locationBtn").click(function () {

        navigator.geolocation.getCurrentPosition(
            function (position) {
    
                getWeatherByCoords(
                    position.coords.latitude,
                    position.coords.longitude
                );
    
            },
            function () {
                alert("Kunde inte hämta din position.");
            }
        );
    
    });
    showLatestRequests();

    $("#cityInput").keydown(function (event) {
        if (event.key === "Enter") {
            const city = $("#cityInput").val().trim();
    
            if (city !== "") {
                getWeatherByCity(city);
            }
        }
    });

});

function getWeatherByCity(city) {

    $.ajax({
        url: API_URL,
        method: "GET",
        data: {
            q: city,
            appid: API_KEY,
            units: "metric"
        },

        success: function (data) {
            showWeather(data);
            saveRequest(data);
            showLatestRequests();
        },

        error: function () {
            $("#weatherResult").html("");
            showPopover();
        }
    });

}
function showWeather(data) {

    const iconUrl =
        `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;

    $("#weatherResult").html(`
        <div class="card mt-4">
            <div class="card-body d-flex justify-content-around align-items-center">
                <img src="${iconUrl}" alt="Weather icon">
                <h3>${data.name}</h3>
                <span>${data.main.temp.toFixed(2)} °C</span>
                <span>${data.wind.speed} m/s</span>
            </div>
        </div>
    `);

}

function showPopover() {

    const input = document.getElementById("cityInput");

    const popover = bootstrap.Popover.getOrCreateInstance(input, {
        content: "Staden hittades inte, försök igen!",
        placement: "bottom",
        trigger: "manual"
    });

    popover.show();

    setTimeout(function () {
        popover.hide();
    }, 3000);

}
function saveRequest(data) {

    let requests = JSON.parse(localStorage.getItem("weatherRequests")) || [];

    const weatherData = {
        name: data.name,
        temp: data.main.temp,
        wind: data.wind.speed,
        icon: data.weather[0].icon
    };

    requests = requests.filter(function (item) {
        return item.name !== weatherData.name;
    });

    requests.unshift(weatherData);

    requests = requests.slice(0, 5);

    localStorage.setItem("weatherRequests", JSON.stringify(requests));

}

function showLatestRequests() {

    const requests = JSON.parse(localStorage.getItem("weatherRequests")) || [];

    $("#latestRequests").html("");

    requests.forEach(function (item) {

        const iconUrl =
            `https://openweathermap.org/img/w/${item.icon}.png`;

        $("#latestRequests").append(`
            <div class="card mt-3">
                <div class="card-body d-flex justify-content-around align-items-center">
                    <img src="${iconUrl}" alt="Weather icon">
                    <h5>${item.name}</h5>
                    <span>${item.temp.toFixed(2)} °C</span>
                    <span>${item.wind} m/s</span>
                </div>
            </div>
        `);

    });

}

function getWeatherByCoords(lat, lon) {
    $.ajax({
        url: API_URL,
        method: "GET",
        data: {
            lat: lat,
            lon: lon,
            appid: API_KEY,
            units: "metric"
        },

        success: function (data) {

            showWeather(data);
            saveRequest(data);
            showLatestRequests();

        },

        error: function () {

            $("#weatherResult").html("");

        }

    });

}