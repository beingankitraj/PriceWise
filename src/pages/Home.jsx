import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, History, Search, Zap } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CategorySelector from '../components/search/CategorySelector';
import CountrySelector, { countries } from '../components/search/CountrySelector';
import SearchBar from '../components/search/SearchBar';
import PriceCard from '../components/results/PriceCard';
import CheapestDeal from '../components/results/CheapestDeal';
import ComparisonHeader from '../components/results/ComparisonHeader';

export default function Home() {
  const [category, setCategory] = useState('products');
  const [country, setCountry] = useState('us');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const queryClient = useQueryClient();

  const { data: savedSearches = [] } = useQuery({
    queryKey: ['savedSearches'],
    queryFn: () => base44.entities.SavedSearch.list('-created_date', 5),
    initialData: []
  });

  const selectedCountry = countries.find(c => c.id === country);

  const getWebsitesForCategory = () => {
    const sites = {
      products: {
        us: 'Amazon.com, Walmart, Target, Best Buy, eBay, Costco, Newegg, B&H Photo',
        uk: 'Amazon.co.uk, Argos, Currys, John Lewis, eBay UK, Very, AO.com',
        in: 'Amazon.in, Flipkart, Myntra, Snapdeal, Croma, Reliance Digital, Tata Cliq, Vijay Sales',
        de: 'Amazon.de, MediaMarkt, Saturn, Otto, eBay.de, Kaufland',
        jp: 'Amazon.co.jp, Rakuten, Yahoo Shopping Japan, Yodobashi, Bic Camera',
        au: 'Amazon.com.au, JB Hi-Fi, Harvey Norman, Kogan, eBay Australia, The Good Guys',
        ca: 'Amazon.ca, Best Buy Canada, Walmart Canada, Costco Canada, The Source',
        ae: 'Amazon.ae, Noon, Jumbo Electronics, Sharaf DG, Carrefour UAE, LuLu'
      },
      flights: 'Google Flights, Skyscanner, Kayak, Momondo, Expedia, Booking.com, Trip.com',
      hotels: 'Booking.com, Hotels.com, Expedia, Agoda, Trivago, Airbnb, Kayak',
      trains: 'Official railway sites, Trainline, Rail Europe, Omio',
      travel_packages: 'Expedia, Booking.com, TripAdvisor, Viator, GetYourGuide'
    };
    
    if (category === 'products') {
      return sites.products[country] || sites.products.us;
    }
    return sites[category];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setResults(null);

    try {
      const prompt = `Search for "${searchQuery}" in ${selectedCountry.name}.
      
Search across these websites: ${getWebsitesForCategory()}

Find current prices from as many of these websites as possible (at least 8-10 different stores).
All prices must be in ${selectedCountry.currency} (${selectedCountry.symbol}).

For each result provide:
- name: exact product name
- price: numeric value in ${selectedCountry.currency} (no symbols, just number)
- merchant: store/website name (e.g., "Amazon", "Flipkart", "Walmart")
- url: direct product link
- rating: product rating if available (0-5)
- details: key specs or features (brief)

Sort by price from lowest to highest. Focus on finding the exact same or very similar products to compare accurately.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                  merchant: { type: "string" },
                  url: { type: "string" },
                  rating: { type: "number" },
                  details: { type: "string" }
                }
              }
            }
          }
        }
      });

      if (response.results && response.results.length > 0) {
        const sortedResults = response.results.sort((a, b) => a.price - b.price);
        setResults({
          query: searchQuery,
          category: category,
          country: country,
          items: sortedResults
        });
      } else {
        setResults({
          query: searchQuery,
          category: category,
          country: country,
          items: []
        });
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveSearch = async () => {
    if (!results || !results.items.length) return;

    setIsSaving(true);
    try {
      await base44.entities.SavedSearch.create({
        query: results.query,
        category: results.category,
        results: results.items,
        last_checked: new Date().toISOString()
      });
      queryClient.invalidateQueries({ queryKey: ['savedSearches'] });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSavedSearch = (saved) => {
    setSearchQuery(saved.query);
    setCategory(saved.category);
    setResults({
      query: saved.query,
      category: saved.category,
      country: country,
      items: saved.results
    });
  };

  const calculateSavings = () => {
    if (!results || results.items.length < 2) return 0;
    const prices = results.items.map(item => item.price);
    return Math.max(...prices) - Math.min(...prices);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-2xl font-bold">PriceWise</h1>
          </div>
          <p className="text-zinc-500">
            Compare prices across all major stores worldwide
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6">
          <CategorySelector selected={category} onSelect={setCategory} />
        </div>

        {/* Country Selector */}
        <div className="mb-6">
          <p className="text-sm text-zinc-500 mb-3">Select your country</p>
          <CountrySelector selected={country} onSelect={setCountry} />
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={handleSearch}
            isSearching={isSearching}
            category={category}
          />
        </div>

        {/* Store info */}
        <div className="mb-8 p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Searching across</p>
          <p className="text-sm text-zinc-300">{getWebsitesForCategory()}</p>
        </div>

        {/* Loading */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
            <p className="text-zinc-400">Searching stores in {selectedCountry.name}...</p>
          </div>
        )}

        {/* Results */}
        {results && results.items.length > 0 && !isSearching && (
          <div>
            <ComparisonHeader
              query={results.query}
              resultsCount={results.items.length}
              onSave={handleSaveSearch}
              isSaving={isSaving}
            />

            {/* Cheapest Deal - Separate Column */}
            <div className="mb-6">
              <CheapestDeal 
                result={results.items[0]} 
                currencySymbol={selectedCountry.symbol}
                savings={calculateSavings()}
              />
            </div>

            {/* All Results */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white mb-4">All Prices</h3>
              <div className="space-y-2">
                {results.items.map((result, index) => (
                  <PriceCard
                    key={index}
                    result={result}
                    isCheapest={index === 0}
                    rank={index + 1}
                    currencySymbol={selectedCountry.symbol}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {results && results.items.length === 0 && !isSearching && (
          <div className="text-center py-20 bg-zinc-900 rounded-xl border border-zinc-800">
            <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400">No results found. Try a different search.</p>
          </div>
        )}

        {/* Saved Searches */}
        {!results && savedSearches.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-4 h-4 text-zinc-500" />
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">Recent Searches</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedSearches.map((saved) => (
                <button
                  key={saved.id}
                  onClick={() => handleLoadSavedSearch(saved)}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 text-left transition-all"
                >
                  <p className="font-medium text-white mb-1">{saved.query}</p>
                  <p className="text-xs text-zinc-500">{saved.results?.length || 0} results · {saved.category}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!results && !isSearching && savedSearches.length === 0 && (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-zinc-300 mb-2">Start Comparing Prices</h3>
            <p className="text-zinc-500 max-w-md mx-auto">
              Search for any product, flight, hotel, or train ticket to find the best deal across all stores in {selectedCountry.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}