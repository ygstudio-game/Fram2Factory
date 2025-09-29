import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Star, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { SearchFilters } from '../types';

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
  onFiltersChange: (filters: SearchFilters) => void;
  placeholder?: string;
  showFilters?: boolean;
  filterOptions?: {
    showLocation?: boolean;
    showCropType?: boolean;
    showPriceRange?: boolean;
    showQuality?: boolean;
    showOrganic?: boolean;
    showRating?: boolean;
    showDeliveryDate?: boolean;
  };
}

const cropTypes = [
  'Rice', 'Wheat', 'Coffee', 'Tea', 'Cotton', 'Sugarcane', 'Corn', 'Barley',
  'Vegetables', 'Fruits', 'Spices', 'Pulses', 'Oilseeds'
];

const qualityOptions = ['Premium', 'Standard', 'Basic'];

const locations = [
  'Punjab, India', 'Karnataka, India', 'Maharashtra, India', 'Gujarat, India',
  'Haryana, India', 'Uttar Pradesh, India', 'Tamil Nadu, India', 'West Bengal, India'
];

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearch,
  onFiltersChange,
  placeholder = "Search farmers, factories, crops...",
  showFilters = true,
  filterOptions = {}
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    priceRange: [0, 200000],
    quantity: [0, 1000]
  });
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const {
    showLocation = true,
    showCropType = true,
    showPriceRange = true,
    showQuality = true,
    showOrganic = true,
    showRating = true,
    showDeliveryDate = true
  } = filterOptions;

  useEffect(() => {
    const count = Object.values(filters).filter(value => {
      if (value === undefined || value === null) return false;
      if (typeof value === 'string' && value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      if (typeof value === 'boolean' && value === false) return false;
      return true;
    }).length;
    setActiveFilterCount(count);
  }, [filters]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      priceRange: [0, 200000],
      quantity: [0, 1000]
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const toggleQuality = (quality: string) => {
    const currentQualities = filters.quality || [];
    const newQualities = currentQualities.includes(quality)
      ? currentQualities.filter(q => q !== quality)
      : [...currentQualities, quality];
    updateFilter('quality', newQualities);
  };

  return (
    <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
      {/* Search Bar */}
      <div className="relative flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500/20"
          />
        </div>
        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="relative px-4 py-3 rounded-xl border-gray-200 hover:border-green-500"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 px-2 py-1 text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.location && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {filters.location}
            </Badge>
          )}
          {filters.cropType && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.cropType}
            </Badge>
          )}
          {filters.organic && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Organic
            </Badge>
          )}
          {filters.quality && filters.quality.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              {filters.quality.join(', ')}
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 h-auto"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="border-t border-gray-200 pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location Filter */}
            {showLocation && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">Location</label>
                <Select value={filters.location || ''} onValueChange={(value) => updateFilter('location', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Crop Type Filter */}
            {showCropType && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">Crop Type</label>
                <Select value={filters.cropType || ''} onValueChange={(value) => updateFilter('cropType', value)}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Delivery Date Filter */}
            {showDeliveryDate && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">Delivery Date</label>
                <Input
                  type="date"
                  value={filters.deliveryDate || ''}
                  onChange={(e) => updateFilter('deliveryDate', e.target.value)}
                  className="rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          {showPriceRange && (
            <div>
              <label className="block mb-3 font-medium text-gray-700">
                Price Range (₹{filters.priceRange?.[0] || 0} - ₹{filters.priceRange?.[1] || 200000})
              </label>
              <Slider
                value={filters.priceRange || [0, 200000]}
                onValueChange={(value) => updateFilter('priceRange', value)}
                max={200000}
                min={0}
                step={5000}
                className="w-full"
              />
            </div>
          )}

          {/* Quantity Range Filter */}
          <div>
            <label className="block mb-3 font-medium text-gray-700">
              Quantity Range ({filters.quantity?.[0] || 0} - {filters.quantity?.[1] || 1000} tons)
            </label>
            <Slider
              value={filters.quantity || [0, 1000]}
              onValueChange={(value) => updateFilter('quantity', value)}
              max={1000}
              min={0}
              step={10}
              className="w-full"
            />
          </div>

          {/* Quality Filter */}
          {showQuality && (
            <div>
              <label className="block mb-3 font-medium text-gray-700">Quality</label>
              <div className="flex flex-wrap gap-2">
                {qualityOptions.map((quality) => (
                  <Badge
                    key={quality}
                    variant={filters.quality?.includes(quality) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-green-100 hover:border-green-300"
                    onClick={() => toggleQuality(quality)}
                  >
                    {quality}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Boolean Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {showOrganic && (
              <div className="flex items-center justify-between">
                <label className="font-medium text-gray-700">Organic Only</label>
                <Switch
                  checked={filters.organic || false}
                  onCheckedChange={(checked) => updateFilter('organic', checked)}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="font-medium text-gray-700">Verified Only</label>
              <Switch
                checked={filters.verified || false}
                onCheckedChange={(checked) => updateFilter('verified', checked)}
              />
            </div>
          </div>

          {/* Rating Filter */}
          {showRating && (
            <div>
              <label className="block mb-3 font-medium text-gray-700">
                Minimum Rating ({filters.rating || 0} stars)
              </label>
              <Slider
                value={[filters.rating || 0]}
                onValueChange={(value) => updateFilter('rating', value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={clearFilters}
              variant="outline"
              className="flex-1 rounded-xl"
            >
              Clear Filters
            </Button>
            <Button
              onClick={() => setShowFilterPanel(false)}
              className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};