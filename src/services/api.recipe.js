import axios from "axios";
import { ApiUrl } from "./Api";

const api = axios.create({
  baseURL: ApiUrl,
  withCredentials: true,
});

export async function createRecipe(formData) {
  const { data } = await api.post("/recipes/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function getAllRecipes(search = "") {
  const { data } = await api.get(`/recipes?search=${search}`);
  return data;
}

export async function getUserRecipes() {
  const { data } = await api.get("/recipes/user");
  return data;
}

export async function getRecipeById(recipeId) {
  const { data } = await api.get(`/recipes/${recipeId}`);
  return data;
}

export async function updateRecipe(recipeId, formData) {
  const { data } = await api.put(`/recipes/${recipeId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteRecipe(recipeId) {
  const { data } = await api.delete(`/recipes/${recipeId}`);
  return data;
}

export async function addToFavorites(recipeId) {
  const { data } = await api.post(`/recipes/${recipeId}/add-favorite`);
  return data;
}

export async function removeFromFavorites(recipeId) {
  const { data } = await api.delete(`/recipes/${recipeId}/remove-favorite`);
  return data;
}

export async function getFavoriteRecipes() {
  const { data } = await api.get("/recipes/favorites");
  return data;
}
