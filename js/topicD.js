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

    var city = info.data[0].city_name;
    var temperature = info.data[0].temp;
    var desc = info.data[0].weather.description;

    document.getElementById('info1').innerHTML = city;
    document.getElementById('info2').innerHTML = temperature + " F&deg;";
    document.getElementById('info3').innerHTML = desc;
}