import { renderWeatherPage } from "./render-weather.js";
import { getWeatherByCityName } from "./data/weather-api.js";


document.querySelector('.js-search-button').addEventListener('click', () => {
  console.log("Search button clicked");
  const cityName = document.querySelector('.js-search-input').value;
  getWeatherByCityName(cityName).then(() => {
    renderWeatherPage();
  }).catch(error => {
    console.error("Error fetching weather data:", error);
  });
});