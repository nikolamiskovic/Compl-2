const API_URL = "https://api.openweathermap.org/data/2.5/weather";

$(document).ready(function () {

    showLatestRequests();

    $("#cityInput").keypress(function (event) {

        if (event.which === 13) {

            const city = $("#cityInput").val().trim();

            if (city !== "") {
                getWeatherByCity(city);}
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
                <img src="${iconUrl}">
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