import { pageHead } from "./shared/weatherHeader.js";
import { getWeatherDescription, extralInfomation, dailyForecastFun, hourlyForecastFun } from "./data/weather.js";
import { errorState } from "./error-state.js";
import { getWeatherByCityName, city, state, country } from "./data/weather-api.js";

document.querySelector('header').innerHTML = pageHead()
let name2 = `${city} ${state}, ${country}`;
export function renderWeatherPage(response) {
  let name = `${city} ${state}, ${country}`;
  if (name2.trim() !== ',') {
    name = name2;
  }
  let temperature = (response.current_weather.temperature).toFixed(0);
  let date = response.current_weather.time;
  let dateObj = new Date(date);
  let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  let formattedDate = dateObj.toLocaleDateString('en-US', options);

  // Usage in your fetch
  const weatherCode = response.current_weather.weathercode;
  const weatherDescription = getWeatherDescription(weatherCode);


  const weatherHTML = `
      <div class="relative md:hidden">
        <div class="absolute flex flex-col content-center top-0 left-0 right-0 bottom-0">
          <div class="m-auto flex flex-col text-center mt-10">
            <h3 class="text-2xl">${name}</h3>
            <span class="text-[#aeaeb7]">${formattedDate}</span>
          </div>
          <div class="m-auto -mt-5 flex content-center gap-x-8">
            <img src="weather-app-main/assets/images/icon-${weatherDescription}.webp" alt="${weatherDescription} icon" class="w-30">
            <h1 class="text-[4.5rem] pt-2 italic">${temperature}&deg;</h1>
          </div>
        </div>
        <img class="m-auto" src="weather-app-main/assets/images/bg-today-small.svg" alt="Small Background">
      </div>
      <div class="relative hidden md:block">
        <div class="absolute flex justify-between content-center md:px-5 md:pt-10 lg:pt-20 lg:px-10 right-0 left-0 z-10">
          <div class="flex flex-col content-center text-center md:mt-6 lg:mt-10">
            <h3 class="md:text-[1.125rem] lg:text-2xl">${name}</h3>
            <span class="text-[#aeaeb7] md:text-[0.85rem]">${formattedDate}</span>
          </div>
          <div class="flex content-center gap-x-8">
            <img src="weather-app-main/assets/images/icon-${weatherDescription}.webp" alt="${weatherDescription} icon" class="w-40 h-40 md:-mt-5 lg:mt-0">
            <h1 class="text-[4.5rem] italic mt-4 lg:mt-7">${temperature}&deg;</h1>
          </div>
        </div>
        <img src="weather-app-main/assets/images/bg-today-large.svg" alt="Large Background" class="relative">
      </div>
      <div class="content-center justify-center grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">${extralInfomation(response)}</div>
      <div class="mt-5">
        <h1>Daily forecast</h1>
        <div class="content-center justify-center grid grid-cols-3 gap-4 mt-6 md:grid-cols-4 lg:grid-cols-8">
          ${dailyForecastFun(response)}
        </div>
      </div>
  `

  document.querySelector('.js-weather-cont').innerHTML = weatherHTML;
  document.querySelector('.js-hourly-cont').innerHTML = hourlyForecastFun(response);
}

document.querySelector('.js-search-input').addEventListener('input', async (event) => {
  const searchSuggestion = document.querySelector('.js-search-suggestion');
  if (event.target.value.length > 1) {
    searchSuggestion.style.display = 'block';
  } else {
    searchSuggestion.style.display = 'none';
  }

  let cityName = event.target.value;
  cityName = cityName.trim().replace(/\s+/g, ' ').toLowerCase();
  let finalQuery = encodeURIComponent(cityName);
  if (cityName.length > 1) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${finalQuery}&count=15`;
    fetch(geocodingUrl).then(response => response.json())
      .then(async geocoding => {
        if (!geocoding.results || geocoding.results.length === 0) {
          throw new Error("City not found");
        }
        geocoding.results = geocoding.results.filter(result => result.country !== '');
        document.querySelector('.js-search-suggestion').innerHTML = '';
        for (let i = 0; i < geocoding.results.length; i++) {
          const suggestionItem = document.createElement('p');
          suggestionItem.textContent = `${geocoding.results[i].name}, ${geocoding.results[i].admin1}, ${geocoding.results[i].country}`;
          suggestionItem.classList.add('js-search-suggestion-item', 'text-[0.85rem]', 'py-2', 'px-3', 'cursor-pointer', 'hover:bg-[#2121309a]');
          // document.querySelector('.js-search-suggestion').innerHTML += suggestionItem.outerHTML;
          document.querySelector('.js-search-suggestion').appendChild(suggestionItem);
          suggestionItem.addEventListener('click', async () => {
            document.querySelector('.js-search-input').value = suggestionItem.textContent;
            searchSuggestion.style.display = 'none';
            let {latitude, longitude} = geocoding.results[i];
            name2 = `${geocoding.results[i].name} ${geocoding.results[i].admin1}, ${geocoding.results[i].country}`;
            const weatehrUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&windspeed_unit=mph&precipitation_unit=inch&timezone=auto`;
            const weatherResponse = await fetch(weatehrUrl).then(r => r.json())
              .then(d => {
                return d;
              })
            renderWeatherPage(weatherResponse);
          });
        }
      }).catch(error => {
        console.error('Uncaught error. Please check your internet connection.', error)
      })
    
  }   
})

document.querySelector('.js-search-button').addEventListener('click', async () => {
  document.querySelector('.js-search-suggestion').style.display = 'none';
  let cityName = document.querySelector('.js-search-input').value;
  cityName = cityName.trim().replace(/\s+/g, ' ').toLowerCase();
  let finalQuery = encodeURIComponent(cityName);
  getWeatherByCityName(finalQuery)
});

window.addEventListener('load', async () => {
  try {
    const weatherResponse = await getWeatherByCityName('Ilorin');
    return weatherResponse;
  } catch (error) {
    console.error("Error fetching weather data on page load:", error);
    document.querySelector('.js-section-1').innerHTML = errorState();
  }
});

window.addEventListener('offline', () => {
  document.querySelector('.js-section-1').innerHTML = errorState();
});

document.body.addEventListener('click', (event) => {
  if (!event.target.classList.contains('js-search-suggestion-item')) {
    document.querySelector('.js-search-suggestion').style.display = 'none';
  }
});