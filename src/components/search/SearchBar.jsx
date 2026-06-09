import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchBar({ value, onChange, onSearch, isSearching, category }) {
  const getPlaceholder = () => {
    const placeholders = {
      products: 'iPhone 15, Nike Air Max, Samsung TV...',
      flights: 'New York to London',
      hotels: 'Hotels in Paris',
      trains: 'Boston to NYC',
      travel_packages: '7-day Italy tour'
    };
    return placeholders[category] || 'Search...';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={getPlaceholder()}
            className="pl-12 pr-4 h-14 text-base bg-zinc-900 border-zinc-800 focus:border-zinc-600 text-white placeholder:text-zinc-500 rounded-xl"
            disabled={isSearching}
          />
        </div>
        <Button
          type="submit"
          disabled={isSearching || !value.trim()}
          className="h-14 px-8 bg-white hover:bg-zinc-200 text-black font-semibold rounded-xl"
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Search'
          )}
        </Button>
      </div>
    </form>
  );
}