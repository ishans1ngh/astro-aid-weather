import { useEffect, useState } from "react";
import WeatherBackground from "@/components/WeatherBackground";
import SearchBar from "@/components/SearchBar";
import CurrentWeather from "@/components/CurrentWeather";
import AIAssistant from "@/components/AIAssistant";
import AirQuality from "@/components/AirQuality";
import ForecastCard from "@/components/ForecastCard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ThemeToggle from "@/components/ThemeToggle";
import { useWeather } from "@/hooks/useWeather";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

const Index = () => {
  const { weather, loading, fetchWeather, detectLocation } = useWeather();
  const [recentCities, setRecentCities] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    // Load recent cities from localStorage
    const saved = localStorage.getItem("recentCities");
    if (saved) {
      setRecentCities(JSON.parse(saved));
    }
    // Load default city on mount
    fetchWeather("London");
  }, []);

  const handleSearch = (city: string) => {
    fetchWeather(city);
    // Save to recent cities
    const updated = [city, ...recentCities.filter(c => c.toLowerCase() !== city.toLowerCase())].slice(0, 5);
    setRecentCities(updated);
    localStorage.setItem("recentCities", JSON.stringify(updated));
    setShowRecent(false);
  };

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
        {/* Header with Theme Toggle */}
        <div className="text-center mb-12 relative">
          <div className="absolute top-0 right-4">
            <ThemeToggle />
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-shimmer drop-shadow-lg">
            Smart Weather Dashboard
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 font-medium">Your AI-powered personal weather assistant ✨</p>
        </div>

        {/* Search Bar with Recent Cities */}
        <div className="mb-12 relative">
          <SearchBar onSearch={handleSearch} onLocationDetect={detectLocation} loading={loading} />
          
          {/* Recent Cities */}
          {recentCities.length > 0 && (
            <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRecent(!showRecent)}
                className="text-muted-foreground hover:text-foreground"
              >
                <History className="w-4 h-4 mr-2" />
                Recent
              </Button>
              {showRecent && recentCities.map((city) => (
                <Button
                  key={city}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(city)}
                  className="glass dark:glass-dark border-primary/30 hover:border-primary/50"
                >
                  {city}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

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

            {/* 7-Day Forecast with Horizontal Scroll */}
            <div className="animate-fade-in">
              <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                7-Day Forecast
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth px-2">
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