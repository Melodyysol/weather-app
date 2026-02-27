function getWeatherDescription(code) {
  const descriptions = {
    0: "sunny",
    1: "partly-cloudy",
    2: "partly-cloudy",
    3: "overcast",
    45: "fog",
    48: "fog",
    51: "drizzle",
    53: "drizzle",
    55: "drizzle",
    56: "drizzle",
    57: "drizzle",
    61: "rain",
    63: "rain",
    65: "rain",
    66: "rain",
    67: "rain",
    71: "snow",
    73: "snow",
    75: "snow",
    77: "snow",
    80: "rain",
    81: "showers",
    82: "showers",
    85: "snow",
    86: "snow",
    95: "storm",
    96: "storm",
    99: "storm"
  };
  return descriptions[code] || "sunny"; // Default fallback
}

// Import selectedUnits from render-weather
let selectedUnits = { temperature: 'celsius', windSpeed: 'kmh', precipitation: 'mm' };

// Update selectedUnits when it changes from render-weather
export function updateUnits(units) {
  selectedUnits = units;
}

function extralInfomation(response, units = selectedUnits) {
  let extralInfo;
  if (response) {
    let wind = response.current_weather.windspeed;
    let humidity = response.hourly.relative_humidity_2m[0];
    let precipitation = response.hourly.precipitation[0];
    let feelsLike = (response.hourly.apparent_temperature[0]).toFixed(0);
    
    const windUnit = units.windSpeed === 'kmh' ? 'km/h' : 'mph';
    const precipUnit = units.precipitation === 'mm' ? 'mm' : 'in';
    const tempUnit = units.temperature === 'celsius' ? '&degC' : '&degF';
    
    const extral = [{
      id: '1001-1000',
      type: 'Feel like',
      value: `${feelsLike}${tempUnit}`
      },{
        id: '1001-1001',
        type: 'Humidity',
        value: `${humidity.toFixed(0)}%`
      },{
        id: '1001-1002',
        type: 'Wind',
        value: `${wind.toFixed(0)}${windUnit}`
      },{
        id: '1001-1003',
        type: 'Precipitate',
        value: `${precipitation.toFixed(0)} ${precipUnit}`
    }];

    extralInfo = function () {
      let html = '';
      extral.forEach(e => {
        html += `
          <div class="bg-[#3d3b5e] flex flex-col gap-y-2 rounded-xl px-4 py-2 min-w-30 text-left border border-gray-600">
            <p class="text-[0.84rem] font-extralight">${e.type}</p>
            <p class="js-${e.id} text-[1.6rem] font-extralight">${e.value}</p>
          </div>
        `
      })
      return html
    }
  }else {
    let extral = [{type: 'Feel like'},{type: 'Humidity'},{type: 'Wind'},{type: 'Precipitate'}];
    extralInfo = function () {
      let html = '';
      extral.forEach(e => {
        html += `
          <div class="bg-[#3d3b5e] flex flex-col gap-y-2 rounded-xl px-4 py-2 min-w-30 text-left border border-gray-600">
            <p class="text-[0.84rem] font-extralight">${e.type}</p>
            <p class="js-${e.id} text-[1.6rem] font-extralight">-</p>
          </div>
        `
      })
      return html
    }
  }
  return extralInfo();
}

// Store current response for day selection
let currentWeatherResponse = null;

function dailyForecastFun(response, units = selectedUnits) {
  let dailyForecastHTML = '';
  if (response) {
    currentWeatherResponse = response; // Store for day selection
    let dailyForecast = response.daily;
    let date = response.current_weather.time;
    let dateObj = new Date(date);
    document.querySelector('.js-hourly-day').innerHTML = dateObj.toLocaleDateString('en-US', { weekday: 'long'});
    const tempUnit = units.temperature === 'celsius' ? '&degC' : '&degF';
    for (let i = 0; i < dailyForecast.time.length; i++) {
      const time = dailyForecast.time[i];
      const date = new Date(time);
      const options = { weekday: 'short' };
      const day = date.toLocaleDateString('en-US', options);
      const maxTemp = dailyForecast.temperature_2m_max[i].toFixed(0);
      const minTemp = dailyForecast.temperature_2m_min[i].toFixed(0);
      const weatherCode = dailyForecast.weathercode[i];
      const weatherDescription = getWeatherDescription(weatherCode);
      dailyForecastHTML += `
        <div class="js-day-card bg-[#3d3b5e] flex flex-col gap-y-2 rounded-xl py-4 text-center border border-gray-600 cursor-pointer hover:opacity-80" data-day-index="${i}">
          <p class="text-[0.84rem] font-extralight">${day}</p>
          <img src="weather-app-main/assets/images/icon-${weatherDescription}.webp" alt="${weatherDescription} icon" class="w-15 m-auto">
          <div class="flex justify-around text-[0.84rem] font-extralight">
            <span class="js-daily-max-temp">${maxTemp}${tempUnit}</span><span class="js-daily-min-temp">${minTemp}${tempUnit}</span>
          </div>
        </div>
      `;
    }
    document.querySelector('.js-daily-cont').addEventListener('click', () => {
      const daysOfWeek = dailyForecast.time.map((t, idx) => {
        const d = new Date(t);
        return { day: d.toLocaleDateString('en-US', { weekday: 'long' }), index: idx };
      });
      const dropdown = document.querySelector('.js-display-dropdown');
      dropdown.innerHTML = '';
      daysOfWeek.forEach(({ day, index }) => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('js-day', 'hover:bg-[#2121309a]', 'cursor-pointer', 'p-2', 'pl-4', 'rounded-md');
        dayElement.textContent = day;
        dayElement.addEventListener('click', (e) => {
          e.stopPropagation();
          console.debug('Day selected:', day, 'Index:', index);
          document.querySelector('.js-hourly-day').textContent = day;
          
          // Update hourly forecast
          const hourlyHTML = hourlyForecastFun(currentWeatherResponse, units, index);
          document.querySelector('.js-hourly-cont').innerHTML = hourlyHTML;
          
          dropdown.classList.add('hidden');
          dropdown.classList.remove('flex');
        });
        dropdown.appendChild(dayElement);
      });
      let isDropdownVisible = dropdown.classList.contains('hidden') ? false : true;
      if (isDropdownVisible) {
        dropdown.classList.add('hidden');
        dropdown.classList.remove('flex');
      } else {
        dropdown.classList.remove('hidden');
        dropdown.classList.add('flex');
      }
    });
  }else {
    for (let i = 0; i < 7; i++) {
      dailyForecastHTML += `
      <div class="bg-[#3d3b5e] flex flex-col gap-y-2 rounded-xl py-4 text-center border border-gray-600 h-32 w-full">
        
      </div>
    `;
    }
  }

  return dailyForecastHTML;
}

function hourlyForecastFun(response, units = selectedUnits, dayIndex = 0) {
  let hourlyForecastHTML = '';
  if (response) {
    let hourlyForecast = response.hourly;
    let dailyForecast = response.daily;
    const tempUnit = units.temperature === 'celsius' ? '&degC' : '&degF';
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    
    // Get the date for the selected day
    const selectedDayDate = new Date(dailyForecast.time[dayIndex]);
    const selectedYear = selectedDayDate.getFullYear();
    const selectedMonth = selectedDayDate.getMonth();
    const selectedDay = selectedDayDate.getDate();
    
    // Filter hourly data for the selected day starting from current hour
    let startIndex = -1;
    for (let i = 0; i < hourlyForecast.time.length; i++) {
      const d = new Date(hourlyForecast.time[i]);
      if (d.getFullYear() === selectedYear && 
          d.getMonth() === selectedMonth && 
          d.getDate() === selectedDay &&
          d.getHours() >= currentHour) {
        startIndex = i;
        break;
      }
    }
    
    // If no hours found from current hour onwards, start from midnight of that day
    if (startIndex === -1) {
      startIndex = hourlyForecast.time.findIndex(t => {
        const d = new Date(t);
        return d.getFullYear() === selectedYear && 
               d.getMonth() === selectedMonth && 
               d.getDate() === selectedDay;
      });
    }
    
    const endIndex = startIndex + 8; // 8 hours
    const filteredTime = hourlyForecast.time.slice(startIndex, endIndex);
    const filteredTemperature = hourlyForecast.temperature_2m.slice(startIndex, endIndex);
    const filteredWeatherCode = hourlyForecast.weathercode.slice(startIndex, endIndex);
    
    // Display 8 hours starting from current hour
    for (let i = 0; i < 8; i++) {
      if (filteredTime[i]) {
        const time = filteredTime[i];
        const date = new Date(time);
        const options = { hour: 'numeric', hour12: true };
        const hour = date.toLocaleTimeString('en-US', options);
        const temperature = filteredTemperature[i].toFixed(0);
        const weatherCode = filteredWeatherCode[i];
        const weatherDescription = getWeatherDescription(weatherCode);
        hourlyForecastHTML += `
          <div class="bg-[#3d3b5e] flex justify-between content-center px-2 rounded-md border border-gray-600">
            <div class="flex items-center py-2 content-center gap-x-2">
              <img src="weather-app-main/assets/images/icon-${weatherDescription}.webp" alt="${weatherDescription} icon" class="w-10">
              <span class="text-[0.85rem]">${hour}</span>
            </div>
            <span class="text-[0.85rem] pt-5">${temperature}${tempUnit}</span>
          </div>
        `;
      }
    }
  }else {
    for (let i = 0; i < 8; i++) {
      hourlyForecastHTML += `
        <div class="bg-[#3d3b5e] flex justify-between content-center px-2 rounded-md border border-gray-600 h-15">
          
        </div>
      `;
    }
  }

  return hourlyForecastHTML;
}

export { getWeatherDescription, extralInfomation, dailyForecastFun, hourlyForecastFun };