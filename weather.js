const API_KEY = "907473a587a04ad39a8153509252802"; // Replace with your actual API key

const weatherInfo = document.getElementById("weather-info");
const error = document.getElementById("error");
const loading = document.getElementById("loading");

async function getWeatherByCity(cityName) {
  showLoading();
  try {
    const weatherUrl = `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${cityName}&days=7&api=no&alerts=no`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    if (response.status !== 200 || data.error) {
      throw new Error(data.error?.message || "City Not Found");
    }
    displayWeather(data);
  } catch (err) {
    showError(err.message);
  }
}

function getWeather() {
  const cityInput = document.getElementById("city-input").value;
  if (!cityInput) return;
  getWeatherByCity(cityInput);
}

function displayWeather(data) {
  weatherInfo.style.display = "block";
  error.style.display = "none";
  loading.style.display = "none";

  document.getElementById("city-name").textContent = data.location.name;
  document.getElementById("date").textContent = data.location.localtime; // Corrected to display date
  document.getElementById(
    "temperature"
  ).textContent = `${data.current.temp_c}℃`;
  document.getElementById("weather-description").textContent =
    data.current.condition.text; // Corrected to access text
  document.getElementById("weather-icon").src = data.current.condition.icon;
  document.getElementById(
    "feels-like"
  ).textContent = `${data.current.feelslike_c}℃`;
  document.getElementById("humidity").textContent = `${data.current.humidity}%`;
  document.getElementById(
    "wind-speed"
  ).textContent = `${data.current.wind_kph}km/h`;
  document.getElementById("uv-index").textContent = data.current.uv_index; // Corrected to access uv_index

  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  data.forecast.forecastday.forEach((day) => {
    const forecastDay = document.createElement("div");
    forecastDay.className = "forecast-day";
    forecastDay.innerHTML = `
            <h3>${new Date(day.date).toLocaleDateString("en-US", {
              weekday: "long",
            })}</h3>
            <img class="forecast-icon" src="${day.day.condition.icon}">
            <p>${Math.round(day.day.maxtemp_c)}℃ / ${Math.round(
      day.day.mintemp_c
    )}℃</p>
            <p>${day.day.condition.text}</p>
        `;
    forecastContainer.appendChild(forecastDay);
  });
}

function showError(message) {
  error.style.display = "block";
  error.textContent = message;
  weatherInfo.style.display = "none";
  loading.style.display = "none";
}

function showLoading() {
  loading.style.display = "block";
  error.style.display = "none";
  weatherInfo.style.display = "none";
}

document.getElementById("city-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});

window.addEventListener("load", () => {
  document.getElementById("city-input").value = "London";
  getWeatherByCity("London");
});
