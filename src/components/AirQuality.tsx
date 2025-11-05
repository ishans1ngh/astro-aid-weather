import { Card } from "@/components/ui/card";
import { Wind } from "lucide-react";

interface AirQualityProps {
  aqi: number;
}

const AirQuality = ({ aqi }: AirQualityProps) => {
  const getAQILevel = (value: number) => {
    if (value <= 50) return { label: "Good", color: "hsl(var(--aqi-good))", textColor: "text-green-600" };
    if (value <= 100) return { label: "Moderate", color: "hsl(var(--aqi-moderate))", textColor: "text-yellow-600" };
    if (value <= 150) return { label: "Unhealthy", color: "hsl(var(--aqi-unhealthy))", textColor: "text-orange-600" };
    return { label: "Very Unhealthy", color: "hsl(var(--aqi-very-unhealthy))", textColor: "text-red-600" };
  };

  const level = getAQILevel(aqi);

  return (
    <Card className="glass dark:glass-dark p-6 rounded-3xl border-2">
      <div className="flex items-center gap-3 mb-4">
        <Wind className="w-6 h-6 text-primary" />
        <h3 className="text-xl font-semibold">Air Quality</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">{aqi}</p>
            <p className={`text-lg font-medium ${level.textColor}`}>{level.label}</p>
          </div>
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl"
            style={{ backgroundColor: level.color }}
          >
            {aqi}
          </div>
        </div>

        {/* AQI Scale */}
        <div className="space-y-2">
          <div className="flex h-4 rounded-full overflow-hidden">
            <div className="flex-1" style={{ backgroundColor: "hsl(var(--aqi-good))" }} />
            <div className="flex-1" style={{ backgroundColor: "hsl(var(--aqi-moderate))" }} />
            <div className="flex-1" style={{ backgroundColor: "hsl(var(--aqi-unhealthy))" }} />
            <div className="flex-1" style={{ backgroundColor: "hsl(var(--aqi-very-unhealthy))" }} />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Good</span>
            <span>Moderate</span>
            <span>Unhealthy</span>
            <span>Very Unhealthy</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          {aqi <= 50 && "Air quality is satisfactory, and air pollution poses little or no risk."}
          {aqi > 50 && aqi <= 100 && "Air quality is acceptable. However, there may be a risk for some people."}
          {aqi > 100 && aqi <= 150 && "Members of sensitive groups may experience health effects."}
          {aqi > 150 && "Health alert: The risk of health effects is increased for everyone."}
        </p>
      </div>
    </Card>
  );
};

export default AirQuality;