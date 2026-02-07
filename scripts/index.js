import { renderWeatherPage } from "./render-weather.js";
import { getWeatherByCityName } from "./data/weather-api.js";


/*
document.querySelector('.js-search-button').addEventListener('click', async () => {
  console.log("Search button clicked");
  let cityName = document.querySelector('.js-search-input').value;
  cityName = cityName.trim();
  cityName = cityName.split(' ')[0];
  console.log("City name entered:", cityName);
  if (cityName.length > 2) {
    const weatherResponse = await getWeatherByCityName(cityName);
    console.log("Weather response received:", weatherResponse); 
    if (weatherResponse) {
      renderWeatherPage(weatherResponse);
    } else {
      console.error("No weather data received for the city:", cityName);
    }
  } else {
    alert("Please enter a valid city name with at least three letters.");
  }
});

*/