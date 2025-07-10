"use client";
import { useState } from "react";
import { debounce } from "lodash";
import { Search, Film } from "lucide-react";

// Mock movie data - replace with your actual API
const mockMovies = [
  {
    id: 1,
    title: "The Dark Knight",
    poster: "https://image.tmdb.org/t/p/w185/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
  },
  {
    id: 2,
    title: "Inception",
    poster: "https://image.tmdb.org/t/p/w185/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
  },
  {
    id: 3,
    title: "Interstellar",
    poster: "https://image.tmdb.org/t/p/w185/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 4,
    title: "The Matrix",
    poster: "https://image.tmdb.org/t/p/w185/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  },
  {
    id: 5,
    title: "Pulp Fiction",
    poster: "https://image.tmdb.org/t/p/w185/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
  },
  {
    id: 6,
    title: "Forrest Gump",
    poster: "https://image.tmdb.org/t/p/w185/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
  },
  {
    id: 7,
    title: "The Shawshank Redemption",
    poster: "https://image.tmdb.org/t/p/w185/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  },
  {
    id: 8,
    title: "Avatar",
    poster: "https://image.tmdb.org/t/p/w185/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
  },
  {
    id: 9,
    title: "Titanic",
    poster: "https://image.tmdb.org/t/p/w185/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
  },
  {
    id: 10,
    title: "The Godfather",
    poster: "https://image.tmdb.org/t/p/w185/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  },
];

const SearchMovieForm = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchMovies = (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);

    // Simulate API call - replace with your actual API
    setTimeout(() => {
      const filteredMovies = mockMovies.filter((movie) =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      console.log("U call me alot", filteredMovies);
      setResults(filteredMovies);
      setShowDropdown(true);
      setIsSearching(false);
    }, 1000);
  };

  const handleSearch = debounce(searchMovies, 1000);

  const onChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleMovieSelect = (movie) => {
    setQuery(movie.title);
    setShowDropdown(false);
    console.log("Selected movie:", movie);
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow click on results
    setTimeout(() => setShowDropdown(false), 150);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          name="search"
          placeholder="Search movies..."
          type="text"
          value={query}
          onChange={onChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all duration-200 bg-gray-800 text-white placeholder-gray-400"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {results.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieSelect(movie)}
              className="flex items-center p-3 hover:bg-gray-700 cursor-pointer transition-colors duration-150 border-b border-gray-700 last:border-b-0"
            >
              <div className="flex-shrink-0 w-12 h-16 bg-gray-600 rounded overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='64' viewBox='0 0 48 64'%3E%3Crect width='48' height='64' fill='%23374151'/%3E%3Cg transform='translate(12 20)'%3E%3Cpath d='M12 0L24 12H16v8h-8v-8H0z' fill='%23d1d5db'/%3E%3C/g%3E%3C/svg%3E";
                  }}
                />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-white truncate">
                  {movie.title}
                </h3>
                <p className="text-xs text-gray-400 mt-1">Movie</p>
              </div>
              <div className="ml-2 flex-shrink-0">
                <Film className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showDropdown && results.length === 0 && query.trim() && !isSearching && (
        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <div className="p-4 text-center text-gray-400">
            <Film className="h-8 w-8 mx-auto mb-2 text-gray-500" />
            <p className="text-sm">No movies found</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchMovieForm;
