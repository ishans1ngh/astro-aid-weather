#!/usr/bin/env python3
"""
Weather API Backend using Python Flask
This provides a REST API for weather data with Supabase integration
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import os
from datetime import datetime
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

API_KEY = os.environ.get('OPENWEATHER_API_KEY', 'bd5e378503939ddaee76f12ad7a97608')
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY', '')

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/weather/<city>', methods=['GET'])
def get_weather(city):
    """Get current weather for a city"""
    try:
        current_url = f'https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric'
        current_response = requests.get(current_url)

        if current_response.status_code != 200:
            return jsonify({'error': 'City not found'}), 404

        current_data = current_response.json()

        forecast_url = f'https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric'
        forecast_response = requests.get(forecast_url)
        forecast_data = forecast_response.json()

        aqi_url = f'https://api.openweathermap.org/data/2.5/air_pollution?lat={current_data["coord"]["lat"]}&lon={current_data["coord"]["lon"]}&appid={API_KEY}'
        aqi_response = requests.get(aqi_url)
        aqi_data = aqi_response.json()

        daily_forecast = []
        for i, item in enumerate(forecast_data['list']):
            if i % 8 == 0 and len(daily_forecast) < 7:
                daily_forecast.append({
                    'day': datetime.fromtimestamp(item['dt']).strftime('%a'),
                    'temp': item['main']['temp'],
                    'condition': item['weather'][0]['main'].lower()
                })

        weather_data = {
            'city': current_data['name'],
            'temp': current_data['main']['temp'],
            'feelsLike': current_data['main']['feels_like'],
            'condition': current_data['weather'][0]['main'].lower(),
            'humidity': current_data['main']['humidity'],
            'windSpeed': current_data['wind']['speed'],
            'visibility': current_data['visibility'] / 1000,
            'pressure': current_data['main']['pressure'],
            'aqi': aqi_data['list'][0]['main']['aqi'] * 50,
            'uvIndex': 5,
            'forecast': daily_forecast
        }

        if supabase:
            try:
                supabase.table('weather_searches').insert({
                    'city': city,
                    'searched_at': datetime.now().isoformat()
                }).execute()
            except:
                pass

        return jsonify(weather_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/weather/coords', methods=['POST'])
def get_weather_by_coords():
    """Get weather by coordinates"""
    try:
        data = request.get_json()
        lat = data.get('lat')
        lon = data.get('lon')

        if not lat or not lon:
            return jsonify({'error': 'Latitude and longitude required'}), 400

        current_url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric'
        current_response = requests.get(current_url)
        current_data = current_response.json()

        return get_weather(current_data['name'])

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/advice', methods=['POST'])
def get_ai_advice():
    """Get AI-powered weather advice"""
    try:
        data = request.get_json()
        temp = data.get('temp', 20)
        humidity = data.get('humidity', 50)
        uvIndex = data.get('uvIndex', 5)
        condition = data.get('condition', 'clear')

        advice = {
            'clothing': get_clothing_advice(temp),
            'health': get_health_tip(temp, humidity, uvIndex),
            'activity': get_activity_suggestion(condition, temp)
        }

        return jsonify(advice)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def get_clothing_advice(temp):
    """Generate clothing advice based on temperature"""
    if temp < 5:
        return "Bundle up! Heavy coat, scarf, and gloves essential today"
    elif temp < 10:
        return "Layer up with a warm jacket — it's chilly out there!"
    elif temp < 15:
        return "A light jacket will keep you comfortable today"
    elif temp < 20:
        return "Perfect hoodie weather — cozy but not too cold!"
    elif temp < 25:
        return "Light, breathable clothes are your best friend today"
    elif temp < 30:
        return "Stay cool with shorts and a tee — it's warm!"
    else:
        return "Beat the heat! Light fabrics and stay hydrated"

def get_health_tip(temp, humidity, uvIndex):
    """Generate health tip based on conditions"""
    if uvIndex > 7:
        return "UV index is very high — sunscreen is a must! Don't skip it"
    elif uvIndex > 5:
        return "Moderate UV levels — protect your skin with SPF 30+"
    elif humidity > 85:
        return "High humidity alert! Drink water regularly to stay fresh"
    elif humidity > 70:
        return "It's a bit muggy — keep a water bottle handy"
    elif temp > 32:
        return "Heat warning! Stay in shade and drink plenty of fluids"
    elif temp > 28:
        return "Warm day ahead — pace yourself and stay cool"
    elif temp < 0:
        return "Freezing temps! Protect exposed skin from frostbite"
    else:
        return "Perfect weather for getting outside — enjoy it!"

def get_activity_suggestion(condition, temp):
    """Generate activity suggestion based on weather"""
    if 'thunder' in condition:
        return "Stay safe indoors — thunderstorms expected"
    elif 'rain' in condition:
        return "Rainy vibes call for cozy indoor time or a movie marathon"
    elif 'snow' in condition:
        return "Snow day! Perfect for building a snowman or hot cocoa"
    elif 'clear' in condition and 20 < temp < 30:
        return "Clear skies and perfect temps — ideal for a picnic or jog"
    elif 'cloud' in condition and temp > 15:
        return "Cloudy but pleasant — great for a peaceful walk"
    elif temp > 30:
        return "Hot day! Hit the pool or find some AC"
    elif temp < 5:
        return "Bundle up and embrace the winter wonderland"
    else:
        return "Beautiful day to explore — make the most of it!"

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
