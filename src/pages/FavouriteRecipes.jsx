import { useState } from "react";
import { Search, Heart, ArrowLeft, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import { useFavoriteRecipes } from "../hooks/useRecipe";
import { useCurrentUser } from "../hooks/useUser";

const FavouriteRecipes = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useFavoriteRecipes();
  const { data: currentUser } = useCurrentUser();

  const favoriteRecipes = data?.data?.recipes || [];
  const user = currentUser?.data;

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe._id}`);
  };

  const handleGoBack = () => {
    navigate("/");
  };

  const filteredRecipes = favoriteRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* Header */}
      <header className="bg-white shadow border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleGoBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <Heart className="w-8 h-8 text-pink-500 fill-current" />
                <h1 className="text-2xl font-bold text-gray-800">
                  My Favorite Recipes
                </h1>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-700">
              <span>Welcome back, {user?.fullName || user?.username}!</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8 flex">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your favorite recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {isLoading && (
          <div className="text-center text-gray-600 py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
            Loading your favorite recipes...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error loading favorite recipes
              </h3>
              <p className="text-red-600">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && !error && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <div className="text-gray-600">
                {searchTerm ? (
                  <>
                    Showing {filteredRecipes.length} of {favoriteRecipes.length}{" "}
                    favorite recipes
                  </>
                ) : (
                  <>
                    You have {favoriteRecipes.length} favorite recipe
                    {favoriteRecipes.length !== 1 ? "s" : ""}
                  </>
                )}
              </div>
              {favoriteRecipes.length > 0 && (
                <div className="text-sm text-pink-600 flex items-center space-x-1">
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Your curated collection</span>
                </div>
              )}
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe._id}
                    recipe={recipe}
                    onClick={handleRecipeClick}
                    isFavorite={true}
                    showFavoriteButton={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-12">
                  {searchTerm ? (
                    <>
                      <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No matching favorites found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        No favorite recipes match "{searchTerm}". Try a
                        different search term.
                      </p>
                      <button
                        onClick={() => setSearchTerm("")}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105"
                      >
                        Clear Search
                      </button>
                    </>
                  ) : favoriteRecipes.length === 0 ? (
                    <>
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No favorite recipes yet
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start exploring recipes and add them to your favorites
                        by clicking the heart icon!
                      </p>
                      <button
                        onClick={handleGoBack}
                        className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                      >
                        <ChefHat className="w-5 h-5" />
                        <span>Explore Recipes</span>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FavouriteRecipes;
