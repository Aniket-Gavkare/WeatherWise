const apiKey = '8be3346476346db0240d7a67ac9d7003'; 
const defaultCity = 'pune';

const weatherCardsContainer = document.querySelector('.weather-cards');
const cityInput = document.getElementById('city-input');
const searchButton = document.getElementById('search-button');
const loadingOverlay = document.querySelector('.loading-overlay');

async function fetchWeather(city) {
    showLoading();
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();
        if (data.cod !== "200") {
            throw new Error("City not found");
        }
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    } finally {
        hideLoading();
    }
}

function showError(message) {
    weatherCardsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}


function showLoading() {
    loadingOverlay.style.visibility = 'visible';
}

function hideLoading() {
    loadingOverlay.style.visibility = 'hidden';

}

function updateWeatherDisplay(data) {
    weatherCardsContainer.innerHTML = '';
    data.list.forEach((item, index) => {
        if (index % 8 === 0) { 
            // Every 8th item represents a daily forecast
            const weatherCard = document.createElement('div');
            weatherCard.className = 'weather-card';
            weatherCard.dataset.date = new Date(item.dt_txt).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
            const weatherCondition = item.weather[0].main;
            weatherCard.style.backgroundImage = `url('./assets/${getWeatherBackground(weatherCondition)}.png')`;
            weatherCard.style.backgroundColor = getWeatherColor(weatherCondition);
            
            weatherCard.innerHTML = `
                <div class="weather-icon">${getWeatherIcon(weatherCondition)}</div>
                <div class="date">${weatherCard.dataset.date}</div>
                <div class="temp">${Math.round(item.main.temp_max)}° ${Math.round(item.main.temp_min)}°</div>
                <div class="weather-details">
                    <div class="conditions">
                        <span>Wind: ${Math.round(item.wind.speed * 3.6)} km/h</span>
                        <span>Humidity: ${item.main.humidity}%</span>
                        <span>Rain: ${item.rain ? item.rain['3h'] : 0}%</span>
                    </div>
                </div>
            `;
            weatherCardsContainer.appendChild(weatherCard);
        }
    });
}

function getWeatherColor(main) {
    switch (main) {
        case 'Clear': return '#f7c22f'; 
        case 'Clouds': return '#b0bec5';
        case 'Rain': return '#4fc3f7';
        case 'Snow': return '#90caf9'; 
        case 'Thunderstorm': return '#f57c00'; 
        default: return '#b0bec5'; 
    }
}


function getWeatherBackground(main) {
    switch (main) {
        case 'Clear': return 'sunny';
        case 'Clouds': return 'cloudy';
        case 'Rain': return 'rainy';
        case 'Snow': return 'snowy';
        default: return 'cloudy';
    }
}

function getWeatherIcon(main) {
    switch (main) {
        case 'Clear': return '☀️';
        case 'Clouds': return '☁️';
        case 'Rain': return '🌧️';
        case 'Snow': return '❄️';
        case 'Thunderstorm': return '🌩️';
        default: return '🌈';
    }
}

async function updateWeather(city) {
    const data = await fetchWeather(city);
    document.querySelector('.heading h1').textContent = city;
    updateWeatherDisplay(data);
}

// Default load
updateWeather(defaultCity);

// Search functionality
searchButton.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        updateWeather(city);
    }
});

//handle Enter key press in input field
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

