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
    <Card className="glass dark:glass-dark p-8 rounded-3xl border-2 hover:scale-[1.02] transition-transform duration-300">
      <div className="space-y-6">
        {/* Location & Date */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">{city}</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Temperature Display */}
        <div className="text-center py-8">
          <div className="relative inline-block">
            <div className="text-8xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent animate-float">
              {Math.round(temp)}°
            </div>
            <p className="text-xl text-muted-foreground mt-2">Feels like {Math.round(feelsLike)}°</p>
          </div>
          <p className="text-2xl font-medium text-foreground mt-4 capitalize">{condition}</p>
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