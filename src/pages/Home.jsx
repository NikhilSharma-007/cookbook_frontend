import { useState, useMemo } from "react";
import { Search, Plus, ChefHat, User, LogOut } from "lucide-react";
import RecipeCard from "../components/RecipeCard";
import { useAllRecipes, useFavoriteRecipes } from "../hooks/useRecipe";
import { useLogout, useCurrentUser } from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 350);

  const { data, isLoading, error } = useAllRecipes(debouncedSearchTerm);
  const recipes = data?.data?.recipes || [];

  const { data: favoritesData } = useFavoriteRecipes();
  const favoriteRecipes = favoritesData?.data?.recipes || [];

  const favoriteRecipeIds = new Set(
    favoriteRecipes.map((recipe) => recipe._id)
  );

  const { data: currentUser } = useCurrentUser();
  const logoutMutation = useLogout();

  const user = currentUser?.data;

  const handleRecipeClick = (recipe) => {
    navigate(`/recipe/${recipe._id}`);
  };

  const handleViewRecipe = (recipe) => {
    navigate(`/recipe/${recipe._id}`);
  };

  const handleAddRecipe = () => {
    navigate("/create-recipe");
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [recipes, debouncedSearchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-white shadow border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <h1 className="text-2xl font-bold text-gray-800">CookBook</h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden lg:flex items-center space-x-2 text-sm text-gray-700">
                <User className="w-4 h-4" />
                <span>Welcome, {user?.fullName || user?.username}!</span>
              </div>

              <button
                onClick={handleAddRecipe}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-2 sm:px-4 rounded-lg shadow transition-all transform hover:scale-105 flex items-center space-x-1 sm:space-x-2"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Create Recipe</span>
              </button>

              <button
                onClick={() => console.log("Navigate to my recipes")}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-3 py-2 sm:px-4 rounded-lg shadow transition-all transform hover:scale-105 flex items-center space-x-1 sm:space-x-2"
              >
                <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">My Recipes</span>
              </button>

              <button
                onClick={() => navigate("/favourite-recipes")}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-3 py-2 sm:px-4 rounded-lg shadow transition-all transform hover:scale-105 flex items-center space-x-1 sm:space-x-2"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Favorites</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 sm:px-4 rounded-lg shadow transition-all disabled:opacity-50 flex items-center space-x-1 sm:space-x-2"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">
                  {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </span>
              </button>
            </div>
          </div>

          <div className="lg:hidden mt-3 text-sm text-gray-600 flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>Welcome, {user?.fullName || user?.username}!</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-600 py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            Loading recipes...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Error loading recipes
              </h3>
              <p className="text-red-600">
                Please try refreshing the page or contact support if the problem
                persists.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-gray-600">
                Showing {filteredRecipes.length} of {recipes.length} recipes
              </div>
              {recipes.length > 0 && (
                <div className="text-sm text-gray-500">
                  Community recipe collection
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  onClick={handleRecipeClick}
                  onViewRecipe={handleViewRecipe}
                  isFavorite={favoriteRecipeIds.has(recipe._id)}
                  showFavoriteButton={true}
                />
              ))}
            </div>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-12">
                  <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {debouncedSearchTerm
                      ? "No recipes found"
                      : "No recipes yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {debouncedSearchTerm
                      ? `No recipes match "${debouncedSearchTerm}". Try a different search term.`
                      : "Start building your personal recipe collection by adding your first recipe!"}
                  </p>
                  <button
                    onClick={handleAddRecipe}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add Your First Recipe</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Home;
