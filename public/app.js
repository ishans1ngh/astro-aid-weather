const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

let currentWeather = null;

const elements = {
    themeToggle: document.getElementById('themeToggle'),
    searchForm: document.getElementById('searchForm'),
    cityInput: document.getElementById('cityInput'),
    locationBtn: document.getElementById('locationBtn'),
    recentCities: document.getElementById('recentCities'),
    loadingState: document.getElementById('loadingState'),
    weatherContent: document.getElementById('weatherContent'),
    currentWeather: document.getElementById('currentWeather'),
    aiAssistant: document.getElementById('aiAssistant'),
    airQuality: document.getElementById('airQuality'),
    forecastCards: document.getElementById('forecastCards'),
    weatherBackground: document.getElementById('weatherBackground')
};

function initApp() {
    loadTheme();
    loadRecentCities();
    setupEventListeners();
    fetchWeather('London');
}

function setupEventListeners() {
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.searchForm.addEventListener('submit', handleSearch);
    elements.locationBtn.addEventListener('click', detectLocation);
}

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}

function loadTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.classList.add('dark');
    }
}

function loadRecentCities() {
    const saved = localStorage.getItem('recentCities');
    if (saved) {
        const cities = JSON.parse(saved);
        renderRecentCities(cities);
    }
}

function saveRecentCity(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities') || '[]');
    cities = [city, ...cities.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    localStorage.setItem('recentCities', JSON.stringify(cities));
    renderRecentCities(cities);
}

function renderRecentCities(cities) {
    if (cities.length === 0) return;

    elements.recentCities.innerHTML = `
        <button class="recent-city-btn" onclick="toggleRecent()">📜 Recent</button>
        ${cities.map(city => `
            <button class="recent-city-btn" onclick="fetchWeather('${city}')">${city}</button>
        `).join('')}
    `;
    elements.recentCities.style.display = 'flex';
}

function handleSearch(e) {
    e.preventDefault();
    const city = elements.cityInput.value.trim();
    if (city) {
        fetchWeather(city);
        elements.cityInput.value = '';
    }
}

function detectLocation() {
    if ('geolocation' in navigator) {
        elements.locationBtn.textContent = '⏳';
        navigator.geolocation.getCurrentPosition(
            position => {
                fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                elements.locationBtn.textContent = '📍';
            },
            () => {
                showToast('Location access denied', 'error');
                elements.locationBtn.textContent = '📍';
            }
        );
    } else {
        showToast('Geolocation not supported', 'error');
    }
}

async function fetchWeatherByCoords(lat, lon) {
    showLoading();
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        fetchWeather(data.name);
    } catch (error) {
        showToast('Unable to fetch weather', 'error');
        hideLoading();
    }
}

async function fetchWeather(city) {
    showLoading();
    try {
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!currentResponse.ok) throw new Error('City not found');

        const currentData = await currentResponse.json();

        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        const aqiResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}`
        );
        const aqiData = await aqiResponse.json();

        const dailyForecast = forecastData.list
            .filter((_, index) => index % 8 === 0)
            .slice(0, 7)
            .map(item => ({
                day: new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                temp: item.main.temp,
                condition: item.weather[0].main.toLowerCase()
            }));

        currentWeather = {
            city: currentData.name,
            temp: currentData.main.temp,
            feelsLike: currentData.main.feels_like,
            condition: currentData.weather[0].main.toLowerCase(),
            humidity: currentData.main.humidity,
            windSpeed: currentData.wind.speed,
            visibility: currentData.visibility / 1000,
            pressure: currentData.main.pressure,
            aqi: aqiData.list[0].main.aqi * 50,
            uvIndex: 5,
            forecast: dailyForecast
        };

        renderWeather();
        saveRecentCity(city);
        showToast(`Weather updated for ${city}`, 'success');
    } catch (error) {
        showToast('Unable to fetch weather data', 'error');
    } finally {
        hideLoading();
    }
}

function renderWeather() {
    if (!currentWeather) return;

    updateBackground();
    renderCurrentWeather();
    renderAIAssistant();
    renderAirQuality();
    renderForecast();

    elements.weatherContent.style.display = 'block';
}

function updateBackground() {
    const hour = new Date().getHours();
    let condition = 'clear';

    if (hour < 6 || hour > 20) condition = 'night';
    else if (currentWeather.condition.includes('rain')) condition = 'rainy';
    else if (currentWeather.condition.includes('cloud')) condition = 'clouds';

    elements.weatherBackground.className = `weather-background ${condition}`;
}

function renderCurrentWeather() {
    const { city, temp, feelsLike, condition, humidity, windSpeed, visibility, pressure } = currentWeather;

    const date = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    elements.currentWeather.innerHTML = `
        <div class="weather-location">
            <h1 class="weather-city">${city}</h1>
            <p class="weather-date">${date}</p>
        </div>

        <div class="weather-temp-display">
            <div class="weather-temp">${Math.round(temp)}°</div>
            <p class="weather-feels-like">Feels like ${Math.round(feelsLike)}°</p>
            <p class="weather-condition">${condition}</p>
        </div>

        <div class="weather-details">
            <div class="weather-detail">
                <span class="detail-icon">💧</span>
                <div>
                    <div class="detail-label">Humidity</div>
                    <div class="detail-value">${humidity}%</div>
                </div>
            </div>
            <div class="weather-detail">
                <span class="detail-icon">💨</span>
                <div>
                    <div class="detail-label">Wind</div>
                    <div class="detail-value">${windSpeed} m/s</div>
                </div>
            </div>
            <div class="weather-detail">
                <span class="detail-icon">👁️</span>
                <div>
                    <div class="detail-label">Visibility</div>
                    <div class="detail-value">${visibility} km</div>
                </div>
            </div>
            <div class="weather-detail">
                <span class="detail-icon">🌡️</span>
                <div>
                    <div class="detail-label">Pressure</div>
                    <div class="detail-value">${pressure} hPa</div>
                </div>
            </div>
        </div>
    `;
}

function renderAIAssistant() {
    const { temp, humidity, uvIndex, condition } = currentWeather;

    const clothingAdvice = getClothingAdvice(temp);
    const healthTip = getHealthTip(temp, humidity, uvIndex);
    const activitySuggestion = getActivitySuggestion(condition, temp);

    elements.aiAssistant.innerHTML = `
        <h3 class="section-title">AI Weather Assistant</h3>

        <div class="advice-item">
            <span class="advice-icon">👕</span>
            <div>
                <div class="advice-title">What to Wear</div>
                <div class="advice-text">${clothingAdvice}</div>
            </div>
        </div>

        <div class="advice-item">
            <span class="advice-icon">💗</span>
            <div>
                <div class="advice-title">Health Tip</div>
                <div class="advice-text">${healthTip}</div>
            </div>
        </div>

        <div class="advice-item">
            <span class="advice-icon">☀️</span>
            <div>
                <div class="advice-title">Activity Suggestion</div>
                <div class="advice-text">${activitySuggestion}</div>
            </div>
        </div>
    `;
}

function renderAirQuality() {
    const { aqi } = currentWeather;
    const level = getAQILevel(aqi);

    elements.airQuality.innerHTML = `
        <h3 class="section-title">Air Quality</h3>

        <div class="aqi-display">
            <div>
                <div class="aqi-value">${aqi}</div>
                <div style="font-size: 1.125rem; font-weight: 600; color: ${level.color}">${level.label}</div>
            </div>
            <div class="aqi-badge" style="background-color: ${level.color}">${aqi}</div>
        </div>

        <div class="aqi-scale">
            <div class="aqi-scale-segment" style="background: #00e400"></div>
            <div class="aqi-scale-segment" style="background: #ffff00"></div>
            <div class="aqi-scale-segment" style="background: #ff7e00"></div>
            <div class="aqi-scale-segment" style="background: #ff0000"></div>
        </div>

        <div class="aqi-labels">
            <span>Good</span>
            <span>Moderate</span>
            <span>Unhealthy</span>
            <span>Very Unhealthy</span>
        </div>

        <p style="margin-top: 1rem; opacity: 0.8; font-size: 0.875rem">${level.description}</p>
    `;
}

function renderForecast() {
    elements.forecastCards.innerHTML = currentWeather.forecast.map(day => `
        <div class="forecast-card">
            <div class="forecast-day">${day.day}</div>
            <div class="forecast-icon">${getWeatherIcon(day.condition)}</div>
            <div class="forecast-temp">${Math.round(day.temp)}°</div>
            <div class="forecast-condition">${day.condition}</div>
        </div>
    `).join('');
}

function getClothingAdvice(temp) {
    if (temp < 5) return "Bundle up! Heavy coat, scarf, and gloves essential today";
    if (temp < 10) return "Layer up with a warm jacket — it's chilly out there!";
    if (temp < 15) return "A light jacket will keep you comfortable today";
    if (temp < 20) return "Perfect hoodie weather — cozy but not too cold!";
    if (temp < 25) return "Light, breathable clothes are your best friend today";
    if (temp < 30) return "Stay cool with shorts and a tee — it's warm!";
    return "Beat the heat! Light fabrics and stay hydrated";
}

function getHealthTip(temp, humidity, uvIndex) {
    if (uvIndex > 7) return "UV index is very high — sunscreen is a must! Don't skip it";
    if (uvIndex > 5) return "Moderate UV levels — protect your skin with SPF 30+";
    if (humidity > 85) return "High humidity alert! Drink water regularly to stay fresh";
    if (humidity > 70) return "It's a bit muggy — keep a water bottle handy";
    if (temp > 32) return "Heat warning! Stay in shade and drink plenty of fluids";
    if (temp > 28) return "Warm day ahead — pace yourself and stay cool";
    if (temp < 0) return "Freezing temps! Protect exposed skin from frostbite";
    return "Perfect weather for getting outside — enjoy it!";
}

function getActivitySuggestion(condition, temp) {
    if (condition.includes('thunder')) return "Stay safe indoors — thunderstorms expected";
    if (condition.includes('rain')) return "Rainy vibes call for cozy indoor time or a movie marathon";
    if (condition.includes('snow')) return "Snow day! Perfect for building a snowman or hot cocoa";
    if (condition.includes('clear') && temp > 20 && temp < 30) return "Clear skies and perfect temps — ideal for a picnic or jog";
    if (condition.includes('cloud') && temp > 15) return "Cloudy but pleasant — great for a peaceful walk";
    if (temp > 30) return "Hot day! Hit the pool or find some AC";
    if (temp < 5) return "Bundle up and embrace the winter wonderland";
    return "Beautiful day to explore — make the most of it!";
}

function getAQILevel(aqi) {
    if (aqi <= 50) return {
        label: 'Good',
        color: '#00e400',
        description: 'Air quality is satisfactory, and air pollution poses little or no risk.'
    };
    if (aqi <= 100) return {
        label: 'Moderate',
        color: '#ffff00',
        description: 'Air quality is acceptable. However, there may be a risk for some people.'
    };
    if (aqi <= 150) return {
        label: 'Unhealthy',
        color: '#ff7e00',
        description: 'Members of sensitive groups may experience health effects.'
    };
    return {
        label: 'Very Unhealthy',
        color: '#ff0000',
        description: 'Health alert: The risk of health effects is increased for everyone.'
    };
}

function getWeatherIcon(condition) {
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('snow')) return '❄️';
    if (condition.includes('cloud')) return '☁️';
    return '☀️';
}

function showLoading() {
    elements.loadingState.style.display = 'block';
    elements.weatherContent.style.display = 'none';
}

function hideLoading() {
    elements.loadingState.style.display = 'none';
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'error' ? '#ff0000' : '#00e400'};
        color: white;
        border-radius: 0.5rem;
        font-weight: 600;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

initApp();
