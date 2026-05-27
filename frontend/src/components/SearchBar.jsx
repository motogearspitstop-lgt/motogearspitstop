import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchSuggestions from './SearchSuggestions';
import { searchProducts } from '@/utils/searchUtils';

const SearchBar = ({ onSearchTriggered }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) setRecentSearches(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        setResults(searchProducts(query).slice(0, 5));
      } else {
        setResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const saveRecentSearch = (term) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter(t => t !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (searchTerm) => {
    const term = typeof searchTerm === 'string' ? searchTerm : query;
    if (term.trim()) {
      saveRecentSearch(term.trim());
      navigate(`/products?search=${encodeURIComponent(term.trim())}`);
      setIsFocused(false);
      setQuery('');
      if (onSearchTriggered) onSearchTriggered();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const highlightMatch = (text, highlight) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === highlight.toLowerCase() ? 
            <strong key={i} className="text-[#e63946]">{part}</strong> : part
        )}
      </span>
    );
  };

  return (
    <div className="w-full relative group" ref={searchRef}>
      <div className="relative flex items-center">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search for helmets, jackets, brands..." 
          className="w-full bg-white border border-gray-300 focus:border-[#e63946] text-gray-900 placeholder-gray-500 rounded-md px-4 py-2.5 pr-20 focus:outline-none transition-all text-sm font-medium z-10 relative shadow-sm" 
        />
        
        {query && (
          <button 
            onClick={() => setQuery('')} 
            className="absolute right-12 z-20 text-gray-400 hover:text-gray-900"
          >
            <X size={16} />
          </button>
        )}

        <button 
          onClick={() => handleSearch()} 
          className="absolute right-0 top-0 h-full px-4 bg-[#e63946] hover:bg-[#d62839] text-white transition-colors rounded-r-md z-20"
        >
          <Search size={18} />
        </button>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -5 }} 
            className="absolute top-full mt-1 left-0 right-0 z-50"
          >
            {!query ? (
              <SearchSuggestions 
                query={query}
                recentSearches={recentSearches}
                onSelect={handleSearch}
                onClearRecent={clearRecentSearches}
              />
            ) : results.length > 0 ? (
              <div className="bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden">
                {results.map((product, index) => (
                  <button 
                    key={`${product.id}-${product.name}-${index}`} 
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setIsFocused(false);
                      setQuery('');
                      if (onSearchTriggered) onSearchTriggered();
                    }}
                    className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 text-left"
                  >
                    <div className="w-12 h-12 bg-gray-100 p-1 flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-sm" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-gray-900 text-sm font-medium line-clamp-1">
                        {highlightMatch(product.name, query)}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                         <span className="text-gray-500 text-xs">{product.brand}</span>
                         <span className="text-[#e63946] text-xs font-bold">₹{product.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </button>
                ))}
                <button 
                  onClick={() => handleSearch()}
                  className="w-full p-3 text-center text-sm text-white bg-[#e63946]/10 hover:bg-[#e63946]/20 text-[#e63946] font-bold transition-colors"
                >
                  View all results for "{query}"
                </button>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 shadow-lg rounded-md p-6 text-center text-gray-500 text-sm">
                No products found matching "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
