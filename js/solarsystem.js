/* Focus Event: just some style for the input field to react on mouse hovering */
let fuoco = document.querySelector('.select');

fuoco.addEventListener('mouseover', function(){
    fuoco.style.cssText = "background: rgba(194,194,194,0.1); transition: background .5s ease-in-out";
});

fuoco.addEventListener('mouseleave',function () {
    fuoco.style.cssText = "background: transparent; transition: background .5s ease-in-out";
});

/* Menu button settings: on click, open the overlaying selection menu */

let openBtn = document.getElementById('openBtn');
openBtn.addEventListener('click',function(){
    document.getElementById('overNav').style.width = "100%";
    document.getElementById('openBtn').style.cssText = "visibility: hidden; transition: visibility .5s linear";
    document.getElementById('logo').style.cssText = "visibility: hidden";
});

/* X button settings: on click, close the overlaying selection menu  */
let closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click', function () {
    document.getElementById('overNav').style.width = "0%";
    document.getElementById('openBtn').style.cssText = "visibility: inherit; transition: visibility .5s linear";
    document.getElementById('logo').style.cssText = "visibility: inherit; transition: visibility .5s linear .4s";
});

/* Menu options settings */
// just a bit of effect on mouse hovering
function scale(el){
    el.style.cssText = "transform: scale(1.1); transition: transform .5s ease-in-out";
}

function unscale(el){
    el.style.cssText = "transform: scale(1); transition: transform .5s ease-in-out";
}

// fill the input value after the selection of a planet and display/hide other HTML elements as needed
function insert(el){
    fuoco.value = el.innerText;
    document.getElementById('overNav').style.width = "0%";
    document.getElementById('openBtn').style.cssText = "visibility: inherit; transition: visibility .5s linear";
    document.getElementById('logo').style.cssText = "visibility: inherit; transition: visibility .5s linear .4s";
    document.getElementById('hint').style.cssText = "visibility: hidden;";
    document.getElementById('bottomBtn').style.display = "none";
    document.getElementById('display-response').style.display = "none";
}


/* Submit Selection to API */
let submit = document.querySelector('.search-wrapper');

submit.addEventListener('click',function(){

    // make sure the tiles are flipped correctly after any search
    let tiles = document.querySelectorAll('.tile');

    tiles.forEach(flipBack);
    function flipBack(el){
        el.style.cssText = "transform: none; transition: transform .3s linear";
    }

    // retrieve the selected value
    let input = document.getElementById('input').value;
    // on submission of empty values, display a reminder
    if(input === ""){
        document.getElementById('hint').innerText = "Please enter or select a name";

    }else {

        // create an instance of XMLHttpRequest
        let request = new XMLHttpRequest();

        // some values have spaces in between, here we match the user selection with the correct body id
        // this single heavenly body required a bit more attention
        if (input === "The Little Prince") {
            input = "petitprince";
        } else if (input.indexOf(" ") !== -1){
            input = (input.replace(/\//g, '')).replace(/ /g,"");
            //console.log();
        }

        // establish the connection
        console.log("Starting API request for:", input);

        request.open('GET', 'https://dark-wave-3324.moonshay76.workers.dev/' + input);

        request.setRequestHeader(
            "Authorization",
            "Bearer 4e276acf-27ff-4dc9-968b-31597d2f9744"
        );

        console.log("Request configured. Sending request...");

        request.onload = function () {
            console.log("Request completed!");
            console.log("Status:", request.status);
            console.log("Response:", request.responseText);

            if (request.status === 200) {
                let data = JSON.parse(request.responseText);
                console.log("Parsed data:", data);
                fillHTMLElement(data);
            } else {
                console.log("API request failed.");
            }
        };

        request.onerror = function () {
            console.log("NETWORK ERROR - Request could not be completed.");
        };

        request.send();
    }
});


function fillHTMLelement(jstring){

    // at this point we need to visualize specific elements (such as the down-pointing arrow, which invites the user to scroll down)
    document.getElementById('bottomBtn').style.cssText = "display: flex; flex-flow: row nowrap; justify-content: center; position:absolute; bottom:4em; left:49%; animation: upDownBtn 2s linear infinite;";
    document.getElementById('display-response').style.cssText = "display: flex; flex-flow: row wrap; align-items: center; justify-content: space-evenly; width: 100vw; height: 100vh;";
    document.getElementById('hint').innerText = "Great! Now scroll down or click on the arrow";
    document.getElementById('hint').style.visibility = "visible";

    // this query will return an array of HTML elements (precisely the backface div tag of the information tiles)
    let backs = document.querySelectorAll('.back');
    // call the function "clean" for each HTML element in the array returned
    backs.forEach(clean);
    // empty any child node within the information tiles
    function clean(back){
        while (back.firstChild) {
            back.removeChild(back.firstChild);
        }
    }

    /* From now to the end of this function, we organize the information in json format provided by the API web service */

    // handle heavenly body name in the Name tile
    if(jstring.englishName !== "") {
        document.getElementById('body-name').innerText = jstring.englishName;
    } else {
        document.getElementById('body-name').innerText = jstring.name;
    }

    //set the background of the Name tile
    let canvas = document.getElementById('sky');
    canvas.style.cssText =  "background: -webkit-linear-gradient(#00111e 30%, #033d5e);\n" +
                            "background: -moz-linear-gradient(#00111e 30%, #033d5e);\n" +
                            "background: -o-linear-gradient(#00111e 30%, #033d5e);\n" +
                            "background: linear-gradient(#00111e 30%, #033d5e);";
    drawing(canvas);

    function drawing(c) {
        let ctx = c.getContext('2d');
        // fit the canvas in the parent container
        c.style.width ='100%';
        c.style.height='100%';

        let xMax = c.width  = canvas.offsetWidth;
        let yMax = c.height = canvas.offsetHeight;

        let hmTimes = Math.round(xMax + yMax);
        // create the stars
        for(let i=0; i<=hmTimes; i++) {
            let randomX = Math.floor((Math.random()*xMax)+1);
            let randomY = Math.floor((Math.random()*yMax)+1);
            let randomSize = Math.floor((Math.random()*2)+1);
            let randomOpacityOne = Math.floor((Math.random()*9)+1);
            let randomOpacityTwo = Math.floor((Math.random()*9)+1);
            let randomHue = Math.floor((Math.random()*360)+1);
            if(randomSize>1) {
                ctx.shadowBlur = Math.floor((Math.random()*15)+5);
                ctx.shadowColor = "white";
            }
            ctx.fillStyle = "hsla("+randomHue+", 30%, 80%, ."+randomOpacityOne+randomOpacityTwo+")";
            ctx.fillRect(randomX, randomY, randomSize, randomSize);
        }
    }

    // handle information in the General Info frame
    let generalBox = document.querySelector('.general');

    // organize the data
    
    
    if(jstring.englishName == "Sun"){
            let p = document.createElement('p');
            generalBox.appendChild(p).innerHTML = "The Sun is the star at the center of the Solar System. It is by far the most important source of energy for life on Earth. ";
    }

    if(jstring.isPlanet === true){
            let p = document.createElement('p');
            generalBox.appendChild(p).innerHTML = jstring.englishName + " is a planet";
    } else if (jstring.isPlanet === false && jstring.englishName !== "Sun") {
            let p = document.createElement('p');
            generalBox.appendChild(p).innerHTML = jstring.englishName + " is a moon of " + jstring.aroundPlanet.planet;
    }


    if(jstring.alternativeName !== ""){
        let p = document.createElement('p');
        generalBox.appendChild(p).innerHTML = "Alternative Name: " + jstring.alternativeName;
    }

    if(jstring.discoveredBy !== "") {
        let p = document.createElement('p');
        generalBox.appendChild(p).innerHTML = "Discovered By: " + jstring.discoveredBy;
    }

    if(jstring.discoveryDate !== "") {
        let p = document.createElement('p');
        generalBox.appendChild(p).innerHTML = "Discovery Date: " + jstring.discoveryDate;
    }

    // handle information in the Orbital Parameters frame
    let orbital = document.querySelector('.orbital');

    if(jstring.perihelion !== 0 && jstring.aphelion !== 0){
        let p1 = document.createElement('p');
        orbital.appendChild(p1).innerHTML = "Perihelion: " + jstring.perihelion + " km";
        let p2 = document.createElement('p');
        orbital.appendChild(p2).innerHTML = "Aphelion: " + jstring.aphelion + " km";
    }

    if(jstring.eccentricity !== ""){
        let p = document.createElement('p');
        orbital.appendChild(p).innerHTML = "Eccentricity: " + jstring.eccentricity;
    }

    if(jstring.sideralOrbit !== ""){
        let p = document.createElement('p');
        orbital.appendChild(p).innerHTML = "Orbital Period: " + jstring.sideralOrbit + " days";
    }

    if(jstring.inclination !== ""){
        let p = document.createElement('p');
        orbital.appendChild(p).innerHTML = "Inclination: " + jstring.inclination + " degrees";
    }

    // handle information in the Physical Properties frame
    let physical = document.querySelector('.physical');

    if(jstring.density !== ""){
        let p = document.createElement('p');
        physical.appendChild(p).innerHTML = "Mean Density: " + jstring.density + " g/cm"+ "<sup>3</sup>";
    }

    if(jstring.gravity !== ""){
        let p = document.createElement('p');
        physical.appendChild(p).innerHTML = "Gravity: " + jstring.gravity + " m/s"+ "<sup>2</sup>";
    }

    if(jstring.meanRadius !== ""){
        let p = document.createElement('p');
        physical.appendChild(p).innerHTML = "Mean Radius: " + jstring.meanRadius + " km";
    }

    if(jstring.vol.volValue !== "" && jstring.vol.volValue !== 0){
        let p = document.createElement('p');
        physical.appendChild(p).innerHTML = "Volume: " + jstring.vol.volValue + " x 10"+"<sup>"+ jstring.vol.volExponent +"</sup>"+" km"+ "<sup>3</sup>";
    }

    if(jstring.mass.massValue !== ""){
        let p = document.createElement('p');
        physical.appendChild(p).innerHTML = "Mass: " + jstring.mass.massValue + " x 10"+"<sup>"+ jstring.mass.massExponent +"</sup>"+ " kg";
    }
}



/* Function to flip the tiles on click */

function flip(el) {
    el.style.cssText = "transform: rotateY(180deg); transition: transform .4s linear .2s";
}

function tapFlip(el) {
    el.style.cssText = "transform: rotateY(180deg); transition: transform .4s linear .2s";
}