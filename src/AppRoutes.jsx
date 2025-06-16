import { Routes, Route, Navigate } from "react-router-dom";
import { useCurrentUser } from "./hooks/useUser";
import LoginRegisterPage from "./pages/LoginRegisterPage";
import Home from "./pages/Home";
import RecipeCreator from "./pages/RecipeCreator";
import FavouriteRecipes from "./pages/FavouriteRecipes";
import RecipeDetails from "./pages/RecipeDetails";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { data: currentUser, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If there's an error (like 401) or no user data, redirect to auth
  if (error || !currentUser?.data) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Public Route Component (redirect to home if already authenticated)
const PublicRoute = ({ children }) => {
  const { data: currentUser, isLoading, error } = useCurrentUser();

  // Don't show loading on public routes if there's an auth error
  if (isLoading && !error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated and no error, redirect to home
  if (currentUser?.data && !error) {
    return <Navigate to="/" replace />;
  }

  // If there's an error or no user, show the auth page
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/auth"
        element={
          <PublicRoute>
            <LoginRegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/create-recipe"
        element={
          <ProtectedRoute>
            <RecipeCreator />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favourite-recipes"
        element={
          <ProtectedRoute>
            <FavouriteRecipes />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recipe/:id"
        element={
          <ProtectedRoute>
            <RecipeDetails />
          </ProtectedRoute>
        }
      />

      {/* Catch all route - redirect to auth */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default AppRoutes;
