let response = {};
let city = '';
let country = '';

async function getWeatherByCityName(cityName){
  const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`;
  const geocodingResponse =await fetch(geocodingUrl)
    .then(response => response.json())
    .then(async geocoding => {
      if (!geocoding.results || geocoding.results.length === 0) {
        throw new Error("City not found");
      }
      city = geocoding.results[0].name;
      country = geocoding.results[0].country;
      const {latitude, longitude} = geocoding.results[0];
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&hourly=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation&windspeed_unit=mph&precipitation_unit=inch&timezone=auto`;
      const weatherResponse = await fetch(weatherUrl)
        .then(response => response.json())
        .then(weatherData => {
          return weatherData;
        });
      response = weatherResponse;
      return response;
    })
}

// getWeatherByCityName('Ilorin').then(() => {
//   console.log(response);
// }).catch(error => {
//   console.error("Error fetching weather data:", error);
// });

export { getWeatherByCityName, response, city, country };