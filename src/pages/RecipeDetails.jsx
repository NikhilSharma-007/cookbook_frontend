import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { User, ChefHat, Heart, ArrowLeft, Calendar } from "lucide-react";
import {
  useAddToFavorites,
  useRemoveFromFavorites,
  useRecipeById,
} from "../hooks/useRecipe";
import { useCurrentUser } from "../hooks/useUser";
import { useFavoriteRecipes } from "../hooks/useRecipe";

const RecipeDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ingredients");

  const { data: recipeData, isLoading, error } = useRecipeById(id);
  const { data: currentUser } = useCurrentUser();
  const { data: favoritesData } = useFavoriteRecipes();
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();

  const recipe = recipeData?.data?.recipe || recipeData?.data;

  // Get favorite recipes and check if current recipe is favorited
  const favoriteRecipes = favoritesData?.data?.recipes || [];
  const favoriteRecipeIds = new Set(
    favoriteRecipes.map((recipe) => recipe._id)
  );
  const isFavorite = recipe ? favoriteRecipeIds.has(recipe._id) : false;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleFavoriteClick = () => {
    if (!recipe) return;

    if (isFavorite) {
      removeFromFavoritesMutation.mutate(recipe._id);
    } else {
      addToFavoritesMutation.mutate(recipe._id);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const isProcessing =
    addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Error loading recipe
            </h3>
            <p className="text-red-600 mb-4">
              {error.message || "Could not load the recipe. Please try again."}
            </p>
            <button
              onClick={handleBack}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Recipe not found
          </h3>
          <p className="text-gray-600 mb-4">
            The recipe you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={handleBack}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <div className="flex items-center space-x-2">
            {currentUser && (
              <button
                onClick={handleFavoriteClick}
                disabled={isProcessing}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isFavorite
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white"
                } ${
                  isProcessing
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-110"
                }`}
                title={
                  isFavorite ? "Remove from Favorites" : "Add to Favorites"
                }
              >
                <Heart
                  className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img
              src={recipe.thumbnailImage}
              alt={recipe.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {recipe.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center">
                  <ChefHat className="w-4 h-4 mr-1" />
                  <span>{recipe.ingredients?.length || 0} ingredients</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>
                    {recipe.postedBy?.name ||
                      recipe.postedBy?.username ||
                      "Anonymous"}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(recipe.postedAt || recipe.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("ingredients")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "ingredients"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Ingredients ({recipe.ingredients?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("instructions")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "instructions"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Instructions
              </button>
            </nav>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === "ingredients" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ingredients
              </h2>
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <div className="grid gap-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-800">
                        {ingredient.name}
                      </span>
                      <span className="text-gray-600">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No ingredients listed</p>
              )}
            </div>
          )}

          {activeTab === "instructions" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Instructions
              </h2>
              <div className="prose max-w-none">
                {recipe.instructions ? (
                  <div
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }}
                  />
                ) : (
                  <p className="text-gray-500 italic">
                    No instructions provided
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Recipe Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Created by:</span>
              <span className="ml-2 font-medium text-gray-800">
                {recipe.postedBy?.name ||
                  recipe.postedBy?.username ||
                  "Anonymous"}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Posted:</span>
              <span className="ml-2 font-medium text-gray-800">
                {formatDate(recipe.postedAt || recipe.createdAt)}
              </span>
            </div>
            <div className="flex items-center">
              <ChefHat className="w-4 h-4 mr-2 text-gray-500" />
              <span className="text-gray-600">Ingredients:</span>
              <span className="ml-2 font-medium text-gray-800">
                {recipe.ingredients?.length || 0} items
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsPage;
