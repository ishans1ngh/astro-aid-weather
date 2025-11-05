import { Card } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Eye, Gauge } from "lucide-react";

interface CurrentWeatherProps {
  temp: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  city: string;
}

const CurrentWeather = ({
  temp,
  feelsLike,
  condition,
  humidity,
  windSpeed,
  visibility,
  pressure,
  city,
}: CurrentWeatherProps) => {
  return (
    <Card className="glass dark:glass-dark p-8 rounded-3xl border-2 hover-lift animate-fade-in">
      <div className="space-y-6">
        {/* Location & Date */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-foreground mb-3 tracking-tight">{city}</h1>
          <p className="text-base text-muted-foreground/70 font-medium">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* Temperature Display */}
        <div className="text-center py-8">
          <div className="relative inline-block">
            <div className="text-9xl font-black bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent animate-float drop-shadow-lg">
              {Math.round(temp)}°
            </div>
            <p className="text-2xl text-muted-foreground/80 mt-4 font-medium">
              Feels like <span className="text-foreground font-semibold">{Math.round(feelsLike)}°</span>
            </p>
          </div>
          <p className="text-3xl font-semibold text-foreground mt-6 capitalize tracking-wide">{condition}</p>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-border/50">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
            <Droplets className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="text-lg font-semibold">{humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
            <Wind className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="text-lg font-semibold">{windSpeed} m/s</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
            <Eye className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Visibility</p>
              <p className="text-lg font-semibold">{visibility} km</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-background/30">
            <Gauge className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="text-lg font-semibold">{pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CurrentWeather;