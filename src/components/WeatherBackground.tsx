import { useEffect, useState } from "react";

interface WeatherBackgroundProps {
  condition: "clear" | "rain" | "snow" | "clouds" | "night";
}

const WeatherBackground = ({ condition }: WeatherBackgroundProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; delay: number }>>([]);

  useEffect(() => {
    if (condition === "rain" || condition === "snow") {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
      }));
      setParticles(newParticles);
    }
  }, [condition]);

  const getBackgroundClass = () => {
    switch (condition) {
      case "clear":
        return "weather-sunny";
      case "rain":
        return "weather-rainy";
      case "snow":
        return "weather-snowy";
      case "night":
        return "weather-night";
      default:
        return "weather-sunny";
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 ${getBackgroundClass()} transition-all duration-1000`}>
      {/* Animated particles for rain/snow */}
      {(condition === "rain" || condition === "snow") && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute ${
                condition === "rain" ? "w-0.5 h-12 bg-white/30" : "w-2 h-2 bg-white rounded-full"
              }`}
              style={{
                left: `${particle.x}%`,
                top: "-10%",
                animation: condition === "rain" 
                  ? `fall ${1 + particle.delay}s linear infinite`
                  : `snowfall ${3 + particle.delay}s linear infinite`,
                animationDelay: `${particle.delay}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Stars for night */}
      {condition === "night" && (
        <div className="absolute inset-0">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse-slow"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes snowfall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default WeatherBackground;