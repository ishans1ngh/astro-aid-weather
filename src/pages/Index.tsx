import { useEffect } from "react";
import WeatherBackground from "@/components/WeatherBackground";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import AIAssistant from "@/components/AIAssistant";
import AirQuality from "@/components/AirQuality";
import ForecastCard from "@/components/ForecastCard";
import { useWeather } from "@/hooks/useWeather";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { weather, loading, fetchWeather, detectLocation } = useWeather();

  useEffect(() => {
    // Load default city on mount
    fetchWeather("London");
  }, []);

  const getWeatherCondition = () => {
    if (!weather) return "clear";
    const hour = new Date().getHours();
    if (hour < 6 || hour > 20) return "night";
    if (weather.condition.includes("rain")) return "rain";
    if (weather.condition.includes("snow")) return "snow";
    if (weather.condition.includes("cloud")) return "clouds";
    return "clear";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <WeatherBackground condition={getWeatherCondition()} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer">
            Smart Weather Dashboard
          </h1>
          <p className="text-lg text-foreground/80">Your AI-powered personal weather assistant</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar onSearch={fetchWeather} onLocationDetect={detectLocation} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {/* Weather Content */}
        {!loading && weather && (
          <div className="space-y-8">
            {/* Current Weather */}
            <CurrentWeather
              temp={weather.temp}
              feelsLike={weather.feelsLike}
              condition={weather.condition}
              humidity={weather.humidity}
              windSpeed={weather.windSpeed}
              visibility={weather.visibility}
              pressure={weather.pressure}
              city={weather.city}
            />

            {/* AI Assistant & Air Quality */}
            <div className="grid md:grid-cols-2 gap-6">
              <AIAssistant
                temp={weather.temp}
                humidity={weather.humidity}
                uvIndex={weather.uvIndex}
                condition={weather.condition}
              />
              <AirQuality aqi={weather.aqi} />
            </div>

            {/* 7-Day Forecast */}
            <div>
              <h2 className="text-3xl font-bold mb-6 text-center">7-Day Forecast</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weather.forecast.map((day, index) => (
                  <ForecastCard
                    key={index}
                    day={day.day}
                    temp={day.temp}
                    condition={day.condition}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;