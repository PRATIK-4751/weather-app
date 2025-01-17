const apiKey = 'bc2dedb4c08e081067b79b462e3b0c2e';

document.getElementById('search-btn').addEventListener('click', () => {
    const location = document.getElementById('search-input').value.trim();
    if (location) {
        fetchWeather(location);
    } else {
        alert('Please enter a location.');
    }
});

window.onload = () => {
    fetchWeather('sikkim');
};

async function fetchWeather(location) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
        );
        if (!response.ok) {
            throw new Error('Invalid location');
        }
        const data = await response.json();
        updateCurrentWeather(data);

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
        );
        const forecastData = await forecastResponse.json();
        updateForecast(forecastData);
    } catch (error) {
        alert(error.message);
    }
}

function updateCurrentWeather(data) {
    const date = new Date();
    document.getElementById('day').textContent = date.toLocaleDateString('en-US', {
        weekday: 'long',
    });
    document.getElementById('date-location').textContent = `${date.toLocaleDateString()} ${data.name}, ${data.sys.country}`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('condition').textContent = data.weather[0].description;
}

function updateForecast(data) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    const dailyForecast = {};
    data.list.forEach((entry) => {
        const date = new Date(entry.dt_txt).toLocaleDateString();
        if (!dailyForecast[date]) {
            dailyForecast[date] = entry;
        }
    });

    Object.keys(dailyForecast).slice(0, 5).forEach((date) => {
        const forecast = dailyForecast[date];
        const forecastDiv = document.createElement('div');
        forecastDiv.classList.add('forecast-day');
        forecastDiv.innerHTML = `
            <p>${new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <p>${Math.round(forecast.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(forecastDiv);
    });
}
