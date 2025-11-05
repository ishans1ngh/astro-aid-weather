import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationDetect: () => void;
}

const SearchBar = ({ onSearch, onLocationDetect }: SearchBarProps) => {
  const [city, setCity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="glass dark:glass-dark pl-12 pr-4 py-6 text-lg rounded-2xl border-2 focus:border-primary/50"
        />
      </div>
      <Button
        type="button"
        onClick={onLocationDetect}
        size="lg"
        className="glass dark:glass-dark px-6 rounded-2xl border-2 hover:border-primary/50 transition-all"
      >
        <MapPin className="w-5 h-5" />
      </Button>
      <Button
        type="submit"
        size="lg"
        className="px-8 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all"
      >
        Search
      </Button>
    </form>
  );
};

export default SearchBar;