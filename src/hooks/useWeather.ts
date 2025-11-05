import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  aqi: number;
  uvIndex: number;
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
  }>;
}

export const useWeather = () => {
  const { toast } = useToast();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "bd5e378503939ddaee76f12ad7a97608"; // OpenWeatherMap API key

  const fetchWeather = async (city: string) => {
    setLoading(true);
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error("City not found");
      }

      const currentData = await currentResponse.json();

      // Fetch forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();

      // Process forecast data (one per day)
      const dailyForecast = forecastData.list
        .filter((_: any, index: number) => index % 8 === 0)
        .slice(0, 7)
        .map((item: any) => ({
          day: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
          temp: item.main.temp,
          condition: item.weather[0].main.toLowerCase(),
        }));

      // Fetch air quality (using coordinates)
      const aqiResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&appid=${API_KEY}`
      );
      const aqiData = await aqiResponse.json();

      setWeather({
        city: currentData.name,
        temp: currentData.main.temp,
        feelsLike: currentData.main.feels_like,
        condition: currentData.weather[0].main.toLowerCase(),
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        visibility: currentData.visibility / 1000,
        pressure: currentData.main.pressure,
        aqi: aqiData.list[0].main.aqi * 50, // Convert to standard AQI scale
        uvIndex: 5, // OpenWeatherMap UV requires separate API call
        forecast: dailyForecast,
      });

      toast({
        title: "Weather updated",
        description: `Showing weather for ${currentData.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to fetch weather data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      const currentData = await currentResponse.json();
      await fetchWeather(currentData.name);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to detect your location.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Please search for a city manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Please search for a city manually.",
        variant: "destructive",
      });
    }
  };

  return { weather, loading, fetchWeather, detectLocation };
};