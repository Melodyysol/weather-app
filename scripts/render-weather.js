import { pageHead } from "./shared/weatherHeader.js";
import { getWeatherDescription, extralInfomation, dailyForecastFun, hourlyForecastFun } from "./data/weather.js";
import { errorState } from "./error-state.js";
import { getWeatherByCityName, getWeatherSugestionData, name2 } from "./data/weather-api.js";

// Add loading animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes load {
    from {
      color: gray;
    }
    to {
      color: white;
    }
  }
  @keyframes dot {
    0%, 100% {
      background-color: gray;
      transform: translateX(0);
    }
    50% {
      background-color: white;
      transform: translateX(-8px);
    }
  }
  .load {
    animation: load 2s linear infinite alternate;
  }
  .dot1, .dot2, .dot3 {
    animation: dot 2s linear infinite alternate;
  }
  .dot1 {
    animation-delay: 0s;
  }
  .dot2 {
    animation-delay: 0.2s;
  }
  .dot3 {
    animation-delay: 0.4s;
  }
  .loading-icon {
    animation: rotate 1s linear infinite;
    display: inline-block;
  }
  .js-search-suggestion {
    display: block; /* control visibility via classes */
  }
  .suggestion-hidden {
    opacity: 0;
    transform: translateY(-6px);
    pointer-events: none;
    transition: opacity 220ms ease, transform 220ms ease;
  }
  .suggestion-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
    transition: opacity 220ms ease, transform 220ms ease;
  }
`;
document.head.appendChild(style);

document.querySelector('header').innerHTML = pageHead()
let listUnits = false
document.querySelector('.js-units-display').addEventListener('click', () => {
  if (listUnits === false) {
    document.querySelector('.js-units-conversion').style.display = 'flex'
    listUnits = true
  }else if(listUnits === true) {
    document.querySelector('.js-units-conversion').style.display = 'none'
    listUnits = false;
  }
})
document.body.addEventListener('click', (event) => {
  if (!event.target.closest('.js-units-display')) {
    document.querySelector('.js-units-conversion').style.display = 'none';
    listUnits = false;
  }
});

let selectedUnits = {
  temperature: 'celsius',
  windSpeed: 'kmh',
  precipitation: 'mm',
  isImperial: false
};

document.querySelector('.js-units-conversion').addEventListener('click', async (event) => {
  if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
    // Make checkboxes exclusive within their group
    const group = document.getElementsByName(event.target.name);
    group.forEach(el => {
      if (el !== event.target) el.checked = false;
    });
    if (!event.target.checked) event.target.checked = true;

    // Update selectedUnits based on which checkbox is checked
    const selectedUnit = event.target.name;
    const selectedValue = event.target.previousElementSibling.textContent;
    
    if (selectedUnit === 'temp-scale') {
      selectedUnits.temperature = selectedValue.includes('Celcius') ? 'celsius' : 'fahrenheit';
    } else if (selectedUnit === 'wind-scale') {
      selectedUnits.windSpeed = selectedValue.includes('Km/h') ? 'kmh' : 'mph';
    } else if (selectedUnit === 'prec-scale') {
      selectedUnits.precipitation = selectedValue.includes('Millimeters') ? 'mm' : 'inch';
    }
    
    // Update isImperial flag
    selectedUnits.isImperial = (selectedUnits.temperature === 'fahrenheit');
    
    // Refresh weather immediately
    const searchInput = document.querySelector('.js-search-input');
    if (searchInput && searchInput.value) {
      const { getWeatherByCityName } = await import('./data/weather-api.js');
      getWeatherByCityName(searchInput.value);
    }
  }
});

// Handle "Switch to Imperial" button
document.querySelector('.js-units-conversion').addEventListener('click', async (event) => {
  if (event.target.id === 'switch-imperial') {
    const isCurrentlyImperial = selectedUnits.isImperial;
    
    // Toggle all units
    if (isCurrentlyImperial) {
      // Switch to metric
      selectedUnits.temperature = 'celsius';
      selectedUnits.windSpeed = 'kmh';
      selectedUnits.precipitation = 'mm';
      selectedUnits.isImperial = false;
      event.target.textContent = 'Switch to Imperial';
    } else {
      // Switch to imperial
      selectedUnits.temperature = 'fahrenheit';
      selectedUnits.windSpeed = 'mph';
      selectedUnits.precipitation = 'inch';
      selectedUnits.isImperial = true;
      event.target.textContent = 'Switch to Metric';
    }
    
    // Update checkboxes to reflect the change
    document.querySelectorAll('input[name="temp-scale"]').forEach(el => el.checked = false);
    document.querySelectorAll('input[name="wind-scale"]').forEach(el => el.checked = false);
    document.querySelectorAll('input[name="prec-scale"]').forEach(el => el.checked = false);
    
    if (!selectedUnits.isImperial) {
      document.querySelectorAll('input[name="temp-scale"]')[0].checked = true;
      document.querySelectorAll('input[name="wind-scale"]')[0].checked = true;
      document.querySelectorAll('input[name="prec-scale"]')[0].checked = true;
    } else {
      document.querySelectorAll('input[name="temp-scale"]')[1].checked = true;
      document.querySelectorAll('input[name="wind-scale"]')[1].checked = true;
      document.querySelectorAll('input[name="prec-scale"]')[1].checked = true;
    }
    
    // Refresh weather immediately
    const searchInput = document.querySelector('.js-search-input');
    if (searchInput && searchInput.value) {
      const { getWeatherByCityName } = await import('./data/weather-api.js');
      getWeatherByCityName(searchInput.value);
    }
  }
});

export { selectedUnits };

export function renderWeatherPage(response) {
  let weatherHTML = ''
  if (response) {
    console.log(response)
    let temperature = (response.current_weather.temperature).toFixed(0);
    let date = response.current_weather.time;
    let dateObj = new Date(date);
    let options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    let formattedDate = dateObj.toLocaleDateString('en-US', options);

    // Usage in your fetch
    const weatherCode = response.current_weather.weathercode;
    const weatherDescription = getWeatherDescription(weatherCode);

    weatherHTML = `
        <div class="relative md:hidden">
          <div class="absolute flex flex-col content-center top-0 left-0 right-0 bottom-0">
            <div class="m-auto flex flex-col text-center mt-10">
              <h3 class="text-2xl">${name2}</h3>
              <span class="text-[#aeaeb7]">${formattedDate}</span>
            </div>
            <div class="m-auto -mt-5 flex content-center gap-x-8">
              <img src="weather-app-main/assets/images/icon-${weatherDescription}.webp" alt="${weatherDescription} icon" class="w-30">
              <h1 class="js-temperature text-[4.5rem] pt-2 italic">${temperature}${selectedUnits.temperature === 'celsius' ? '&deg;C' : '&deg;F'}</h1>
            </div>
          </div>
          <img class="m-auto" src="weather-app-main/assets/images/bg-today-small.svg" alt="Small Background">
        </div>
        <div class="relative hidden md:block">
          <div class="absolute flex justify-between content-center md:px-5 md:pt-10 lg:pt-20 lg:px-10 right-0 left-0">
            <div class="flex flex-col content-center text-center md:mt-6 lg:mt-10">
              <h3 class="md:text-[1.125rem] lg:text-2xl">${name2}</h3>
              <span class="text-[#aeaeb7] md:text-[0.85rem]">${formattedDate}</span>
            </div>
            <div class="flex content-center gap-x-8">
              <img src="weather-app-main/assets/images/icon-${weatherDescription}.webp" alt="${weatherDescription} icon" class="w-40 h-40 md:-mt-5 lg:mt-0">
              <h1 class="js-temperature text-[4.5rem] italic mt-4 lg:mt-7">${temperature}${selectedUnits.temperature === 'celsius' ? '&deg;C' : '&deg;F'}</h1>
            </div>
          </div>
          <img src="weather-app-main/assets/images/bg-today-large.svg" alt="Large Background" class="relative">
        </div>
        <div class="content-center justify-center grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">${extralInfomation(response, selectedUnits)}</div>
        <div class="mt-5">
          <h1>Daily forecast</h1>
          <div class="content-center justify-center grid grid-cols-3 gap-4 mt-6 md:grid-cols-4 lg:grid-cols-8">
            ${dailyForecastFun(response, selectedUnits)}
          </div>
        </div>
    `
  }else {
    weatherHTML =  `
        <div class="relative w-full h-40 rounded-xl bg-[#3d3b5e] flex flex-col md:hidden">
          <div class="m-auto mb-0 flex gap-x-2">
            <div class="dot1 bg-white h-2 w-2 rounded-full"></div>
            <div class="dot2 bg-white h-2 w-2 rounded-full -mt-1"></div>
            <div class="dot3 bg-white h-2 w-2 rounded-full"></div>
          </div>
          <div class="load m-auto mt-0">Loading...</div>
        </div>
        <div class="relative hidden md:flex md:flex-col w-190 gap-y-2 rounded-xl h-72 bg-[#3d3b5e]">
          <div class="m-auto mb-0 flex gap-x-2">
            <div class="dot1 bg-white h-2 w-2 rounded-full"></div>
            <div class="dot2 bg-white h-2 w-2 rounded-full -mt-1"></div>
            <div class="dot3 bg-white h-2 w-2 rounded-full"></div>
          </div>
          <div class="load m-auto mt-0">Loading...</div>
        </div>
        <div class="content-center justify-center grid grid-cols-2 gap-4 mt-6 md:grid-cols-4">${extralInfomation()}</div>
        <div class="mt-5">
          <h1>Daily forecast</h1>
          <div class="content-center justify-center grid grid-cols-3 gap-4 mt-6 md:grid-cols-4 lg:grid-cols-8">
            ${dailyForecastFun()}
          </div>
        </div>
    `
  }
  
  document.querySelector('.js-weather-cont').innerHTML = weatherHTML;
  document.querySelector('.js-hourly-cont').innerHTML = hourlyForecastFun(response, selectedUnits);
}

function showLoadingState(searchSuggestion) {
  const loadingSearch = document.createElement('div');
  loadingSearch.innerHTML = `
    <img class="loading-icon w-5" src="weather-app-main/assets/images/icon-loading.svg" alt="Loading Icon">
    <span class="text-[0.85rem]">Search in progress...</span>
    `;
  loadingSearch.classList.add('text-[0.85rem]', 'py-2', 'px-3', 'flex', 'gap-x-2', 'content-center');
  searchSuggestion.innerHTML = '';
  searchSuggestion.appendChild(loadingSearch);
  
  // Hide suggestions once weather data is loaded
  const hideOnSuccess = () => {
    searchSuggestion.classList.remove('suggestion-visible');
    searchSuggestion.classList.add('suggestion-hidden');
    document.removeEventListener('weather:loaded', hideOnSuccess);
  };
  document.addEventListener('weather:loaded', hideOnSuccess);
}

document.querySelector('.js-search-input').addEventListener('input', async (event) => {
  const searchSuggestion = document.querySelector('.js-search-suggestion');
  showLoadingState(searchSuggestion)
  getWeatherSugestionData(event);
})

document.querySelector('.js-search-button').addEventListener('click', async () => {
  const cityName = document.querySelector('.js-search-input').value;
  const searchSuggestion = document.querySelector('.js-search-suggestion');
  
  if (cityName.trim().length === 0) return;
  
  // Show loading state
  showLoadingState(searchSuggestion)
  
  // Start the weather fetch
  getWeatherByCityName(cityName);
});
/*
window.addEventListener('load', async () => {
  try {
    // get user location and fetch weather data for that location
    const userLocation = await new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        }, error => {
          reject(error);
        });
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });

    const { latitude, longitude } = userLocation;
    console.log('User location:', latitude, longitude);
    geocodingUrl = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&count=1`;
    fetch(geocodingUrl).then(r => r.json())
      .then(geocoding => {
        if (!geocoding.results || geocoding.results.length === 0) {
          throw new Error("City not found");
        }
        city = geocoding.results[0].name === undefined ? '' : geocoding.results[0].name;
        state = geocoding.results[0].admin1 === undefined ? '' : geocoding.results[0].admin1;
        country = geocoding.results[0].country === undefined ? '' : geocoding.results[0].country;
        name2 = `${geocoding.results[0].name} ${geocoding.results[0].admin1}, ${geocoding.results[0].country.length <= 7 ? geocoding.results[0].country : geocoding.results[0].country_code}`;
      }).catch(error => {
        console.error('Error fetching geocoding data:', error);
      });
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl).then(r => r.json())
      .then(d => {
        return d;
      });
    renderWeatherPage(weatherResponse);
    return weatherResponse;
  } catch (error) {
    console.error("Error fetching weather data on page load:", error);
    alert("Failed to fetch weather data on page load. Please check your internet connection and allow location access to get weather information for your area.");
  }
});
*/

window.addEventListener('offline', () => {
  document.querySelector('.js-section-1').innerHTML = errorState();
});

// Close search suggestions when clicking outside the search area
document.body.addEventListener('click', (event) => {
  const clickedInSearchArea = event.target.closest('.js-search-cont');
  const clickedInSearchButton = event.target.closest('.js-search-button');
  if (!clickedInSearchArea && !clickedInSearchButton) {
    document.querySelector('.js-search-suggestion').style.display = 'none';
  }
});