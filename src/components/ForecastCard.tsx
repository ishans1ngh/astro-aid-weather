import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, CloudSnow, Sun, CloudDrizzle } from "lucide-react";

interface ForecastCardProps {
  day: string;
  temp: number;
  condition: string;
}

const ForecastCard = ({ day, temp, condition }: ForecastCardProps) => {
  const getWeatherIcon = () => {
    const iconClass = "w-8 h-8";
    if (condition.includes("rain")) return <CloudRain className={iconClass} />;
    if (condition.includes("snow")) return <CloudSnow className={iconClass} />;
    if (condition.includes("cloud")) return <Cloud className={iconClass} />;
    if (condition.includes("drizzle")) return <CloudDrizzle className={iconClass} />;
    return <Sun className={iconClass} />;
  };

  return (
    <Card className="glass dark:glass-dark p-4 rounded-2xl border-2 hover:scale-105 transition-transform duration-300">
      <div className="text-center space-y-3">
        <p className="font-medium text-muted-foreground">{day}</p>
        <div className="flex justify-center text-primary">{getWeatherIcon()}</div>
        <p className="text-2xl font-bold">{Math.round(temp)}°</p>
        <p className="text-sm text-muted-foreground capitalize">{condition}</p>
      </div>
    </Card>
  );
};

export default ForecastCard;