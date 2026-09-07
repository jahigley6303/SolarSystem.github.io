// ***********Topic 4 AJAX Requesting a JSON File************** */

var btn = document.getElementById('btn');

var coords = {
    "Detroit,MI":        { lat: 42.3314,  lon: -83.0458 },
    "Salt+Lake+City,UT": { lat: 40.7608,  lon: -111.8910 },
    "Houston,AK":        { lat: 61.6303,  lon: -149.8064 }
};

btn.addEventListener('click', function () {

    var city = document.forms.list.city.value;

    if (!city) {
        alert("Please select a city first.");
        return;
    }

    var loc = coords[city];

    var rqt = new XMLHttpRequest();

    rqt.open('GET', 'https://api.open-meteo.com/v1/forecast?latitude=' + loc.lat +
        '&longitude=' + loc.lon +
        '&current=temperature_2m,weather_code&temperature_unit=fahrenheit', true);

    rqt.onload = function () {

        console.log("Status:", rqt.status);
        console.log("Response:", rqt.responseText);

        if (rqt.status === 200) {

            var data = JSON.parse(rqt.responseText);
            fillHTMLElement(data, city);

        } else {

            console.log("API request failed.");
            document.getElementById('info1').innerHTML = "Unable to retrieve weather data.";
            document.getElementById('info2').innerHTML = "Status: " + rqt.status;
            document.getElementById('info3').innerHTML = "Please check the API key.";

        }
    };

    rqt.onerror = function () {
        console.log("Network Error");
    };

    rqt.send();

});

function fillHTMLElement(info, cityName) {

    var temperature = info.current.temperature_2m;
    var weatherCode = info.current.weather_code;
    var desc = getWeatherDescription(weatherCode);

    document.getElementById('info1').innerHTML = decodeURIComponent(cityName).replace('+', ' ');
    document.getElementById('info2').innerHTML = temperature + " F&deg;";
    document.getElementById('info3').innerHTML = desc;
}

function getWeatherDescription(code) {
    var codes = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Depositing rime fog",
        51: "Light drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        95: "Thunderstorm"
    };
    return codes[code] || "Unknown conditions";
}