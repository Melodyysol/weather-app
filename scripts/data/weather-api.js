import { renderWeatherPage, selectedUnits } from "../render-weather.js";

let name2 = '';
let isRefresh = true;
let originalSection1Content = ''; // Store original content

// Save original content when page loads
document.addEventListener('DOMContentLoaded', () => {
  originalSection1Content = document.querySelector('.js-section-1').innerHTML;
});

// US state abbreviation to full name mapping
const stateAbbrevMap = {
  'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas', 'ca': 'california',
  'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware', 'fl': 'florida', 'ga': 'georgia',
  'hi': 'hawaii', 'id': 'idaho', 'il': 'illinois', 'in': 'indiana', 'ia': 'iowa',
  'ks': 'kansas', 'ky': 'kentucky', 'la': 'louisiana', 'me': 'maine', 'md': 'maryland',
  'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota', 'ms': 'mississippi', 'mo': 'missouri',
  'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada', 'nh': 'new hampshire', 'nj': 'new jersey',
  'nm': 'new mexico', 'ny': 'new york', 'nc': 'north carolina', 'nd': 'north dakota', 'oh': 'ohio',
  'ok': 'oklahoma', 'or': 'oregon', 'pa': 'pennsylvania', 'ri': 'rhode island', 'sc': 'south carolina',
  'sd': 'south dakota', 'tn': 'tennessee', 'tx': 'texas', 'ut': 'utah', 'vt': 'vermont',
  'va': 'virginia', 'wa': 'washington', 'wv': 'west virginia', 'wi': 'wisconsin', 'wy': 'wyoming'
};

function getWeatherSugestionData(event) {
  const searchSuggestion = document.querySelector('.js-search-suggestion');
  // Restore original content when user starts new search
  document.querySelector('.js-section-1').innerHTML = originalSection1Content;
  
  if (event.target.value.length > 1) {
    searchSuggestion.classList.remove('suggestion-hidden');
    searchSuggestion.classList.add('suggestion-visible');
  } else {
    searchSuggestion.classList.remove('suggestion-visible');
    searchSuggestion.classList.add('suggestion-hidden');
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
          suggestionItem.textContent = `${geocoding.results[i].name === undefined ? '' : geocoding.results[i].name}, ${geocoding.results[i].admin1 === undefined ? '' : geocoding.results[i].admin1}, ${geocoding.results[i].country === undefined ? '' : geocoding.results[i].country}`;
          suggestionItem.classList.add('js-search-suggestion-item', 'text-[0.85rem]', 'py-2', 'px-3', 'cursor-pointer', 'hover:bg-[#2121309a]');
          // document.querySelector('.js-search-suggestion').innerHTML += suggestionItem.outerHTML;
          document.querySelector('.js-search-suggestion').appendChild(suggestionItem);
          suggestionItem.addEventListener('click', () => {
            const text = suggestionItem.textContent;
            console.debug('suggestion clicked:', text);
            document.querySelector('.js-search-input').value = text;
            searchSuggestion.classList.remove('suggestion-visible');
            searchSuggestion.classList.add('suggestion-hidden');
            // Trigger centralized lookup (don't await here)
            try {
              getWeatherByCityName(text);
            } catch (err) {
              console.error('Error fetching weather for suggestion click', err);
              alert('Failed to fetch weather for the selected suggestion.');
            }
          });
        }
      }).catch(error => {
        console.error('Uncaught error. Please check your internet connection.', error)
      })
    
  } else {
    const el = document.querySelector('.js-search-suggestion');
    el.classList.remove('suggestion-visible');
    el.classList.add('suggestion-hidden');
  }
}
function getWeatherByCityName(cityName) {
  cityName = cityName.trim().replace(/\s+/g, ' ').toLowerCase();
  console.debug('getWeatherByCityName called with:', cityName);
  const firstName = cityName.split(',')[0];
  const secondName = cityName.split(',')[1] ? cityName.split(',')[1].trim() : '';
  const lastName = cityName.split(',')[2] ? cityName.split(',')[2].trim() : '';
  if (cityName.length > 1) {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(firstName)}&count=15`;
    fetch(geocodingUrl).then(response => response.json())
      .then(async geocoding => {
        if (!geocoding.results || geocoding.results.length === 0) {
          const searchSuggestion = document.querySelector('.js-search-suggestion');
          searchSuggestion.classList.remove('suggestion-visible');
          searchSuggestion.classList.add('suggestion-hidden');
          document.querySelector('.js-section-1').innerHTML = `
           <div style="display: flex; justify-content: center; width: 100%; height: 16rem;">
             <div style="font-weight: 800; font-size: 1.125rem;">No search result found!</div>
           </div>
         `
        }
        geocoding.results = geocoding.results.filter(result => result.country !== '');
        let matchedResult;
        console.log(geocoding.results)
        
        // Normalize and check if state/country were provided
        const firstNameLower = firstName.toLowerCase();
        const secondNameLower = secondName.toLowerCase();
        const lastNameLower = lastName.toLowerCase();
        const stateProvided = secondName.trim() !== '';
        const countryProvided = lastName.trim() !== '';
        
        // Try to resolve state abbreviation to full name
        const resolvedState = stateAbbrevMap[secondNameLower] || secondNameLower;
        
        for (let i = 0; i < geocoding.results.length; i++) {
          const r = geocoding.results[i];
          const name = (r.name || '').toLowerCase();
          const admin1 = (r.admin1 || '').toLowerCase();
          const country = (r.country || '').toLowerCase();
          
          const nameMatch = name.includes(firstNameLower);
          const stateMatch = admin1.includes(resolvedState) || admin1.includes(secondNameLower);
          const countryMatch = country.includes(lastNameLower);
          
          // Match based on what was provided
          if (!stateProvided && !countryProvided) {
            // city only
            if (nameMatch) { matchedResult = r; break; }
          } else if (stateProvided && !countryProvided) {
            // city + state
            if (nameMatch && stateMatch) { matchedResult = r; break; }
          } else if (!stateProvided && countryProvided) {
            // city + country
            if (nameMatch && countryMatch) { matchedResult = r; break; }
          } else {
            // city + state + country
            if (nameMatch && stateMatch && countryMatch) { matchedResult = r; break; }
          }
        }
        if (!matchedResult) {
          matchedResult = geocoding.results[0];
        }

        name2 = `${matchedResult.name} ${matchedResult.admin1}, ${matchedResult.country.length <= 7 ? matchedResult.country : matchedResult.country_code}`;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${matchedResult.latitude}&longitude=${matchedResult.longitude}&temperature_unit=${selectedUnits.temperature}&wind_speed_unit=${selectedUnits.windSpeed}&precipitation_unit=${selectedUnits.precipitation}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=weathercode,temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto`;
        const weatherResponse = await fetch(weatherUrl).then(r => r.json())
          .then(d => {
            return d;
          })
        renderWeatherPage(weatherResponse);
        // Dispatch event to notify render-weather.js that loading is complete
        document.dispatchEvent(new CustomEvent('weather:loaded', { detail: { weatherResponse } }));
      })
    
  }
}

export { getWeatherByCityName, getWeatherSugestionData, name2, isRefresh };