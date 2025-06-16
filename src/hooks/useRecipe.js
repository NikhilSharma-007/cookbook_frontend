import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRecipe,
  deleteRecipe,
  getAllRecipes,
  getUserRecipes,
  getRecipeById,
  updateRecipe,
  addToFavorites,
  removeFromFavorites,
  getFavoriteRecipes,
} from "../services/api.recipe";
import toast from "react-hot-toast";

export const useAllRecipes = (search) => {
  return useQuery({
    queryKey: ["recipes", search],
    queryFn: () => getAllRecipes(search),
    staleTime: 5 * 60 * 1000,
  });
};

// Current User Recipes
export const useUserRecipes = () => {
  return useQuery({
    queryKey: ["userRecipes"],
    queryFn: getUserRecipes,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRecipeById = (id) => {
  return useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["recipes"]);
      toast.success("Recipe created successfully!");
    },
    onError: () => {
      toast.error("Failed to create recipe.");
    },
  });
};

// Update Recipe
export const useUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["recipes"]);
      toast.success("Recipe updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update recipe.");
    },
  });
};

// Delete Recipe
export const useDeleteRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRecipe,
    onSuccess: () => {
      queryClient.invalidateQueries(["recipes"]);
      toast.success("Recipe deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete recipe.");
    },
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"]);
      toast.success("Recipe added to favorites!");
    },
    onError: () => {
      toast.error("Failed to add recipe to favorites.");
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries(["favoriteRecipes"]);
      toast.success("Recipe removed from favorites!");
    },
    onError: () => {
      toast.error("Failed to remove recipe from favorites.");
    },
  });
};

export const useFavoriteRecipes = () => {
  return useQuery({
    queryKey: ["favoriteRecipes"],
    queryFn: getFavoriteRecipes,
    staleTime: 5 * 60 * 1000,
  });
};
