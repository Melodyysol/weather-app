import { errorState } from "../error-state.js";
import { renderWeatherPage } from "../render-weather.js";


let city = '';
let state = '';
let country = '';
let isRefresh = false


async function getWeatherByCityName(cityName) {
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=15`;
  let geocoding = await fetch(geocodingUrl).then(r => r.json())
    .then(d => {
      return d
    })

  if (!geocoding.results || geocoding.results.length === 0) {
    alert(`If failed, Try entering a valid city name with at least three letters only. You entered: "${cityName}"`);
    return;
  }
  geocoding.results = geocoding.results.filter(result => result.country !== undefined);
  city = geocoding.results[0].name === undefined ? '' : geocoding.results[0].name;
  state = geocoding.results[0].admin1 === undefined ? '' : geocoding.results[0].admin1;
  country = geocoding.results[0].country === undefined ? '' : geocoding.results[0].country;
  let {latitude, longitude} = geocoding.results[0];
  const weatehrUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&windspeed_unit=mph&precipitation_unit=inch&timezone=auto`;
  const weatherResponse = await fetch(weatehrUrl).then(r => r.json())
    .then(d => {
      return d;
    }).catch(error => {
      console.error('Uncaught error. Pleaase check your internet.', error)
      const cityName = document.querySelector('.js-search-input').value;
      if (!isRefresh && cityName.length > 2) {
        document.querySelector('.js-section-1').innerHTML = errorState()
        isRefresh = true
      }else if(cityName.length < 3) {
        alert(`Please enter a valid city name with at least three letters. You entered: "${cityName}"`);
      }
    })
  renderWeatherPage(weatherResponse);
}

// getWeatherByCityName('Ilorin').then(() => {
//   console.log(response);
// }).catch(error => {
//   console.error("Error fetching weather data:", error);
// });

export { getWeatherByCityName, city, state, country };