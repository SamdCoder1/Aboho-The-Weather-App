

//get all the necessary elements from the DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput')
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');


//Default city when the page loads
let cityInput="Kolkata"

//add click event to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        //change from default city to the clicked one
        cityInput = e.target.innerHTML;
        // function that fetches and displays all the data from the weather api
        fetchWeatherData();
        //fade out animation
        app.style.opacity="0";
    });
})

//Add submit event to the form
form.addEventListener('submit', (e) => {
//If th einput field(searchbar) is empty, throw an alert
if (search.value.length==0) {
    alert('Please type in a city name');
} 
else{
    cityInput=search.value;
    /* Function that fetches and displays all the data from the weather api */
    fetchWeatherData();
    //remove all text from the input field
    search.value="";
    //Fade out the app (simp anima)
    app.style.opacity="0";
}

//prevents the default behavior of the form
e.preventDefault();
});

// function that returns a day of the Week(MOn,Tues...) from a date (12.03.2023)
// we will use this function later
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    return weekday[new Date (`${day}/${month}/${year}`).getDay()];
};

//Function that Feathes and displays the data from the weather api
function fetchWeatherData(){
    //Fetch the data and dynamically add the city name with template literals 
    // use your own key
    fetch(`https://api.weatherapi.com/v1/current.json?key=81a45cc888334663b4b155236231908&q=${cityInput}`)
    //Take the data (which is in Json format) and convert it to a regular js object
    .then(response=> response.json())
    .then(data=>{
        //You can console lock the data to see what is available
        console.log(data);
        //Let's start by adding the temperature and weather condition to the page
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        //Get the date and time from the city and extract 
        // the day month year and time into individual variables
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const d = parseInt(date.substr(5, 2));
        const m = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        // Reformat the date into something more appealing and add it to the page
        //  original format : 2021-10-09 17:53
        //  new format : 17:53 Friday 9, 10 2021
        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${m}, ${d} ${y}`;
        timeOutput.innerHTML = time;

        // Add the name of the city into the page
        nameOutput.innerHTML= data.location.name;
        // Get the corresponding icon url for the weather and extract a part of it
        const iconId= data.current.condition.icon.substr(
            "//cdn.weatherapi.com/weather/64x64/".length);
            // Reformat the icon url to your own local folder path and add it to the page
            icon.src= "./public/icons/"+ iconId;
            // Add the weather details to the page
            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            // Set default time of the day
            let timeOfDay = "day";
            // Get the unique ID for each weather condition
            const code = data.current.condition.code;

            // Change to night if it's night time in the city
            if(!data.current.is_day) {
                timeOfDay = "night";
            }

            if(code==1000) {
                // Set the background image to clear if the weather is clear
                app.style.backgroundImage=`
                url(./public/images/${timeOfDay}/clear.jpg)`;
                // Change the button BG color depending on if its day or night
                btn.style.background = "#e5ba92";
                if(timeOfDay == "night") {
                    btn.style.background= "#181e27";
                }
            }
            // Same thing for cloudy weather
            else if (
            code == 1083 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282 
            ) {
                app.style.backgroundImage= `
                url(./public/images/${timeOfDay}/cloudy.jpg)`;
                btn.style.background= "#fa6d1b";
                if(timeOfDay == "night") {
                    btn.style.background="#181e27";
                }
                // and rain
            }
            else if (
                code == 1063 ||
                code == 1069 ||
                code == 1072 ||
                code == 1150 ||
                code == 1153 ||
                code == 1180 ||
                code == 1183 ||
                code == 1186 ||
                code == 1189 ||
                code == 1192 ||
                code == 1195 ||
                code == 1204 ||
                code == 1207 ||
                code == 1240 ||
                code == 1243 ||
                code == 1246 ||
                code == 1249 ||
                code == 1252 
                ) {
                    app.style.backgroundImage= `
                url(./public/images/${timeOfDay}/rainy.jpg)`;
                btn.style.background= "#647d75";
                if(timeOfDay == "night") {
                    btn.style.background="#325c80";
                }
                // And Finally Snow
                }
                else{
                    app.style.backgroundImage= `
                url(./public/images/${timeOfDay}/snowy.jpg)`;
                btn.style.background= "#4d72aa";
                if(timeOfDay == "night") {
                    btn.style.background="#1b1b1b";
                }
            }
            // Fade in the page once all is done
            app.style.opacity= "1";

    })
    // If the user types a city that doesn't exist through an alert
    .catch(() => {
        alert('City not found, please try again');
        app.style.opacity = "1";
    });

}

// Call the function on page load
fetchWeatherData();

// fade in the page
app.style.opacity= "1";