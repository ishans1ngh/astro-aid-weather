import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle } from "lucide-react";

interface ForecastCardProps {
  day: string;
  temp: number;
  condition: string;
}

const ForecastCard = ({ day, temp, condition }: ForecastCardProps) => {
  const getWeatherIcon = () => {
    if (condition.includes("rain")) return <CloudRain className="w-10 h-10 text-primary drop-shadow-lg" />;
    if (condition.includes("drizzle")) return <CloudDrizzle className="w-10 h-10 text-primary/80 drop-shadow" />;
    if (condition.includes("snow")) return <CloudSnow className="w-10 h-10 text-primary drop-shadow-lg" />;
    if (condition.includes("cloud")) return <Cloud className="w-10 h-10 text-primary/70 drop-shadow" />;
    return <Sun className="w-10 h-10 text-accent drop-shadow-lg animate-pulse-slow" />;
  };

  const getTempColor = () => {
    if (temp < 10) return "text-blue-500";
    if (temp < 20) return "text-primary";
    if (temp < 30) return "text-accent";
    return "text-orange-500";
  };

  return (
    <Card className="glass dark:glass-dark p-6 rounded-3xl border-2 text-center hover-lift flex-shrink-0 w-36 animate-fade-in">
      <p className="text-sm font-bold text-muted-foreground/80 mb-4 uppercase tracking-wider">{day}</p>
      <div className="flex justify-center mb-4">{getWeatherIcon()}</div>
      <p className={`text-3xl font-black ${getTempColor()} drop-shadow`}>{Math.round(temp)}°</p>
      <p className="text-xs text-muted-foreground mt-3 capitalize font-medium">{condition}</p>
    </Card>
  );
};

export default ForecastCard;