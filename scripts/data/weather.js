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

function dailyForecastFun(response, units = selectedUnits) {
  let dailyForecastHTML = '';
  if (response) {
    let dailyForecast = response.daily;
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
      // console.log(day, maxTemp, minTemp, weatherCode, weatherDescription);
      dailyForecastHTML += `
        <div class="bg-[#3d3b5e] flex flex-col gap-y-2 rounded-xl py-4 text-center border border-gray-600">
          <p class="text-[0.84rem] font-extralight">${day}</p>
          <img src="weather-app-main/assets/images/icon-${weatherDescription}.webp" alt="${weatherDescription} icon" class="w-15 m-auto">
          <div class="flex justify-around text-[0.84rem] font-extralight">
            <span class="js-daily-max-temp">${maxTemp}${tempUnit}</span><span class="js-daily-min-temp">${minTemp}${tempUnit}</span>
          </div>
        </div>
      `;
    }
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

function hourlyForecastFun(response, units = selectedUnits) {
  let hourlyForecastHTML = '';
  if (response) {
    let hourlyForecast = response.hourly;
    const tempUnit = units.temperature === 'celsius' ? '&degC' : '&degF';
    for (let i = 0; i < 8; i++) {
      const time = hourlyForecast.time[i];
      const date = new Date(time);
      const options = { hour: 'numeric', hour12: true };
      const hour = date.toLocaleTimeString('en-US', options);
      const temperature = hourlyForecast.temperature_2m[i].toFixed(0);
      const weatherCode = hourlyForecast.weathercode[i];
      const weatherDescription = getWeatherDescription(weatherCode);
      // console.log(hour, temperature, weatherCode, weatherDescription);
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