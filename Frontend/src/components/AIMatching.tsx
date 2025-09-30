import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, Search, Star, MapPin, MessageCircle, Brain, Filter, Zap } from 'lucide-react';
import type { User, Screen } from '../types';

interface AIMatchingProps {
  user: User | null;
  onNavigate: (screen: Screen) => void;
}

export function AIMatching({ user, onNavigate }: AIMatchingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [sortBy, setSortBy] = useState('match');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFactory = user?.role === 'factory';

  useEffect(() => {
    setLoading(true);
    let apiUrl = isFactory
      ? 'https://fram2factory.vercel.app/api/users?role=farmer'
      : 'https://fram2factory.vercel.app/api/users?role=factory';
    if (isFactory) {
      // Factories see farmers
      apiUrl = 'https://fram2factory.vercel.app/api/users?role=farmer';
    } else if (user?.role === 'farmer') {
      // Farmers see factories
      apiUrl = 'https://fram2factory.vercel.app/api/users?role=factory';
    }
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        // Filter matches by searchQuery (name/location/crop/requirement)
        let filtered = data;
        if (searchQuery.trim()) {
          const q = searchQuery.trim().toLowerCase();
          filtered = data.filter((item) =>
            (item.name && item.name.toLowerCase().includes(q)) ||
            (item.location && item.location.toLowerCase().includes(q)) ||
            (item.crops && item.crops.some((c) => c.toLowerCase().includes(q))) ||
            (item.requirements && item.requirements.some((r) => r.toLowerCase().includes(q)))
          );
        }
        setMatches(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isFactory, searchQuery, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold">AI-Powered Matching</h1>
            <p className="text-sm text-gray-600">
              {isFactory ? 'Find the perfect farmers' : 'Discover factory opportunities'}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-5 h-5 text-purple-500" />
            <Zap className="w-4 h-4 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* AI Insights Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="m-4 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl border border-purple-200"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h3 className="font-medium text-purple-800">AI Insights</h3>
        </div>
        <p className="text-sm text-purple-700">
          {isFactory 
            ? 'Based on your requirements, we found 3 highly compatible farmers within 100km radius'
            : 'Your wheat crop quality matches 5 premium factories seeking Grade A produce'
          }
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder={isFactory ? "Search farmers..." : "Search factories..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/50 backdrop-blur-sm"
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCrop} onValueChange={setSelectedCrop}>
            <SelectTrigger className="flex-1 bg-white/50">
              <SelectValue placeholder="Crop Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Crops</SelectItem>
              <SelectItem value="wheat">Wheat</SelectItem>
              <SelectItem value="rice">Rice</SelectItem>
              <SelectItem value="corn">Corn</SelectItem>
              <SelectItem value="soybeans">Soybeans</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="flex-1 bg-white/50">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Matches */}
      {loading ? (
        <div className="px-4 pb-20 text-center text-gray-500">Loading matches...</div>
      ) : (
        <div className="px-4 pb-20 space-y-4">
          {matches.map((match, index) => (
            <Card key={match._id || match.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 p-3 text-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">{match.matchScore || 'N/A'}%</span>
                      </div>
                      <span className="text-sm">AI Match Score</span>
                    </div>
                    {match.verified && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-medium">{match.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                    <MapPin className="w-3 h-3" />
                    {match.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{match.rating || 'N/A'}</span>
                  </div>
                  {/* Crops/Requirements */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(match.crops || match.requirements || []).map((item) => (
                        <Badge key={item} variant="outline" className="text-xs">{item}</Badge>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      {match.quantity && <span className="font-medium">{match.quantity}</span>}
                      {match.price && <span className="text-green-600 font-medium ml-1">{match.price}</span>}
                    </div>
                  </div>
                  {/* Certifications */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {(match.certifications || []).map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs bg-green-100 text-green-700">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                      {isFactory ? 'Send Inquiry' : 'Express Interest'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}