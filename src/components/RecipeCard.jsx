import { Clock, User, Heart } from "lucide-react";
import { useAddToFavorites, useRemoveFromFavorites } from "../hooks/useRecipe";
import { useCurrentUser } from "../hooks/useUser";

const RecipeCard = ({
  recipe,
  onClick,
  onViewRecipe,
  isFavorite = false,
  showFavoriteButton = true,
}) => {
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const { data: currentUser } = useCurrentUser();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getIngredientCount = () => {
    return recipe.ingredients?.length || 0;
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();

    if (isFavorite) {
      removeFromFavoritesMutation.mutate(recipe._id);
    } else {
      addToFavoritesMutation.mutate(recipe._id);
    }
  };

  const handleViewRecipeClick = (e) => {
    e.stopPropagation();
    if (onViewRecipe) {
      onViewRecipe(recipe);
    } else if (onClick) {
      onClick(recipe);
    }
  };

  const isProcessing =
    addToFavoritesMutation.isPending || removeFromFavoritesMutation.isPending;

  return (
    <div
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden relative"
      onClick={() => onClick && onClick(recipe)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.thumbnailImage}
          alt={recipe.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />

        {/* Favorite Button */}
        {showFavoriteButton && currentUser && (
          <button
            onClick={handleFavoriteClick}
            disabled={isProcessing}
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
              isFavorite
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-white bg-opacity-80 text-gray-600 hover:bg-red-500 hover:text-white"
            } ${
              isProcessing ? "opacity-50 cursor-not-allowed" : "hover:scale-110"
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {recipe.name}
        </h3>

        <p
          className="text-gray-600 text-sm mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: recipe.instructions }}
        />

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            <span>
              {recipe.postedBy?.name ||
                recipe.postedBy?.username ||
                "Anonymous"}
            </span>
          </div>

          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{formatDate(recipe.postedAt || recipe.createdAt)}</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {getIngredientCount()} ingredients
            </span>
            <button
              onClick={handleViewRecipeClick}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium hover:underline transition-colors"
            >
              View Recipe →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
