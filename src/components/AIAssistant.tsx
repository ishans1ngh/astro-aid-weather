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
    if (temp < 5) return "Bundle up! Heavy coat, scarf, and gloves essential today ❄️";
    if (temp < 10) return "Layer up with a warm jacket — it's chilly out there!";
    if (temp < 15) return "A light jacket will keep you comfortable today 🧥";
    if (temp < 20) return "Perfect hoodie weather — cozy but not too cold!";
    if (temp < 25) return "Light, breathable clothes are your best friend today 👕";
    if (temp < 30) return "Stay cool with shorts and a tee — it's warm! ☀️";
    return "Beat the heat! Light fabrics and stay hydrated 💧";
  };

  const getHealthTip = () => {
    if (uvIndex > 7) return "UV index is very high — sunscreen is a must! Don't skip it 🧴";
    if (uvIndex > 5) return "Moderate UV levels — protect your skin with SPF 30+";
    if (humidity > 85) return "High humidity alert! Drink water regularly to stay fresh 💦";
    if (humidity > 70) return "It's a bit muggy — keep a water bottle handy";
    if (temp > 32) return "Heat warning! Stay in shade and drink plenty of fluids";
    if (temp > 28) return "Warm day ahead — pace yourself and stay cool";
    if (temp < 0) return "Freezing temps! Protect exposed skin from frostbite";
    return "Perfect weather for getting outside — enjoy it! 🌿";
  };

  const getActivitySuggestion = () => {
    if (condition.includes("thunder")) return "Stay safe indoors — thunderstorms expected ⚡";
    if (condition.includes("rain")) return "Rainy vibes call for cozy indoor time or a movie marathon 🎬";
    if (condition.includes("snow")) return "Snow day! Perfect for building a snowman or hot cocoa ☃️";
    if (condition.includes("clear") && temp > 20 && temp < 30) 
      return "Clear skies and perfect temps — ideal for a picnic or jog 🏃";
    if (condition.includes("cloud") && temp > 15) 
      return "Cloudy but pleasant — great for a peaceful walk 🚶";
    if (temp > 30) return "Hot day! Hit the pool or find some AC 🏊";
    if (temp < 5) return "Bundle up and embrace the winter wonderland ❄️";
    return "Beautiful day to explore — make the most of it! 🌤️";
  };

  return (
    <Card className="glass dark:glass-dark p-6 rounded-3xl border-2 hover-lift animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-7 h-7 text-accent animate-pulse drop-shadow-lg" />
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          AI Weather Assistant
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/30 hover-lift">
          <Shirt className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 drop-shadow" />
          <div>
            <p className="font-bold text-sm text-primary/80 mb-2 uppercase tracking-wide">What to Wear</p>
            <p className="text-foreground font-medium leading-relaxed">{getClothingAdvice()}</p>
          </div>
        </div>

        <div className="flex gap-3 p-5 rounded-2xl bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 border border-accent/30 hover-lift">
          <Heart className="w-6 h-6 text-accent flex-shrink-0 mt-0.5 drop-shadow" />
          <div>
            <p className="font-bold text-sm text-accent/80 mb-2 uppercase tracking-wide">Health Tip</p>
            <p className="text-foreground font-medium leading-relaxed">{getHealthTip()}</p>
          </div>
        </div>

        <div className="flex gap-3 p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/30 hover-lift">
          <Sun className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 drop-shadow" />
          <div>
            <p className="font-bold text-sm text-primary/80 mb-2 uppercase tracking-wide">Activity Suggestion</p>
            <p className="text-foreground font-medium leading-relaxed">{getActivitySuggestion()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIAssistant;