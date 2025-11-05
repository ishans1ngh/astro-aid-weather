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
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 dark:to-black/30" />
      
      {/* Animated particles for rain/snow */}
      {(condition === "rain" || condition === "snow") && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={`absolute ${
                condition === "rain" 
                  ? "w-0.5 h-16 bg-gradient-to-b from-white/40 to-white/10" 
                  : "w-2 h-2 bg-white/80 rounded-full shadow-lg"
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

      {/* Stars and moon for night */}
      {condition === "night" && (
        <>
          <div className="absolute top-20 right-20 w-24 h-24 bg-white/90 rounded-full shadow-[0_0_80px_rgba(255,255,255,0.6)] animate-pulse-slow" />
          <div className="absolute inset-0">
            {Array.from({ length: 150 }).map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse-slow"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  boxShadow: `0 0 ${Math.random() * 4 + 2}px rgba(255,255,255,0.8)`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Sun glow for clear day */}
      {condition === "clear" && (
        <div className="absolute top-20 right-20 w-32 h-32 bg-accent/40 rounded-full blur-3xl animate-pulse-slow" />
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