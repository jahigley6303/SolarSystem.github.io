// ***********Topic 4 AJAX Requesting a JSON File************** */

// create a variable to hold the html button item
var btn = document.getElementById('btn');

// add an event listener to the button
btn.addEventListener('click', function () {

    // retrieve the value from the radio button checked
    var city = document.forms.list.city.value;

    // create an instance of XMLHttpRequest
    var rqt = new XMLHttpRequest();

    // establish the connection
    rqt.open('GET', 'https://api.open-meteo.com/v1/forecast?latitude=42.3314&longitude=-83.0458&current=temperature_2m,weather_code&temperature_unit=fahrenheit', true);

    // if the request is successfully completed
    rqt.onload = function () {

        console.log("Status:", rqt.status);
        console.log("Response:", rqt.responseText);

        if (rqt.status === 200) {

            var data = JSON.parse(rqt.responseText);

            fillHTMLElement(data);

        } else {

            console.log("API request failed.");

            document.getElementById('info1').innerHTML =
                "Unable to retrieve weather data.";
            document.getElementById('info2').innerHTML =
                "Status: " + rqt.status;
            document.getElementById('info3').innerHTML =
                "Please check the API key.";

        }
    };

    rqt.onerror = function () {
        console.log("Network Error");
    };

    rqt.send();

});


function fillHTMLElement(info) {

    var temperature = info.current.temperature_2m;
    var weatherCode = info.current.weather_code;
    var desc = getWeatherDescription(weatherCode);

    document.getElementById('info1').innerHTML = "Selected city";
    document.getElementById('info2').innerHTML = temperature + " F&deg;";
    document.getElementById('info3').innerHTML = desc;
}

// Open-Meteo gives a numeric WMO weather code, not a text description,
// so you need to translate it yourself
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