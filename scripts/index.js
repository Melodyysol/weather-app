import { renderWeatherPage } from "./render-weather.js";
import { getWeatherByCityName } from "./data/weather-api.js";

document.querySelector('.js-search-button').addEventListener('click', () => {
  console.log("Search button clicked");
  let cityName = document.querySelector('.js-search-input').value;
  cityName = cityName.trim();
  cityName = cityName.split(' ')[0];
  console.log("City name entered:", cityName);
  getWeatherByCityName(cityName).then(() => {
    renderWeatherPage();
  }).catch(error => {
    console.error("Error fetching weather data:", error);
  });
});