import { Card } from "@/components/ui/card";
import { Sparkles, Shirt, Heart, Sun } from "lucide-react";

interface AIAssistantProps {
  temp: number;
  humidity: number;
  uvIndex: number;
  condition: string;
}

const AIAssistant = ({ temp, humidity, uvIndex, condition }: AIAssistantProps) => {
  const getClothingAdvice = () => {
    if (temp < 10) return "Wear a warm jacket and layers";
    if (temp < 20) return "Light jacket recommended";
    if (temp < 25) return "Light clothing, perfect weather";
    return "Stay cool with light, breathable clothing";
  };

  const getHealthTip = () => {
    if (uvIndex > 6) return "UV index high - wear sunscreen";
    if (humidity > 80) return "High humidity - stay hydrated";
    if (temp > 30) return "Hot weather - drink plenty of water";
    return "Great conditions for outdoor activities";
  };

  const getActivitySuggestion = () => {
    if (condition.includes("rain")) return "Indoor activities recommended";
    if (condition.includes("snow")) return "Perfect for winter sports";
    if (temp > 25 && temp < 35) return "Great day for a walk or picnic";
    return "Enjoy your day outdoors";
  };

  return (
    <Card className="glass dark:glass-dark p-6 rounded-3xl border-2">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-accent animate-pulse" />
        <h3 className="text-xl font-semibold">AI Weather Assistant</h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <Shirt className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-muted-foreground mb-1">What to Wear</p>
            <p className="text-foreground">{getClothingAdvice()}</p>
          </div>
        </div>

        <div className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20">
          <Heart className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-muted-foreground mb-1">Health Tip</p>
            <p className="text-foreground">{getHealthTip()}</p>
          </div>
        </div>

        <div className="flex gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <Sun className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-muted-foreground mb-1">Activity Suggestion</p>
            <p className="text-foreground">{getActivitySuggestion()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistant;