import { useState, useEffect } from "react";
import { Eye, EyeOff, User, Mail, Lock, ChefHat, Sparkles } from "lucide-react";
import { useRegister, useLogin } from "../hooks/useUser";

const LoginRegisterPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const { mutateAsync: registerMutation, isPending: isregisterPending } =
    useRegister();
  const { mutateAsync: loginMutation, isPending: isloginPending } = useLogin();

  const isLoading = isregisterPending || isloginPending;

  // Reset form when switching between login/register
  useEffect(() => {
    setFormData({
      fullName: "",
      email: "",
      username: "",
      password: "",
    });
  }, [isLogin]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login API call
        await loginMutation({
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
      } else {
        // Register API call
        await registerMutation({
          fullName: formData.fullName,
          email: formData.email,
          username: formData.username,
          password: formData.password,
        });
      }
    } catch (error) {
      console.error(isLogin ? "Login error:" : "Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="relative w-full max-w-md z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Recipe Cookbook
          </h1>
          <p className="text-gray-600 text-lg font-medium">
            {isLogin ? "Welcome back, chef! 👨‍🍳" : "Join our culinary family 🍳"}
          </p>
        </div>

        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-red-50/50 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-200/20 to-transparent rounded-3xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-200/20 to-transparent rounded-3xl"></div>

          <div className="relative z-10">
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1.5 mb-8 shadow-inner">
              <button
                onClick={() => setIsLogin(true)}
                type="button"
                className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  isLogin
                    ? "bg-white text-orange-600 shadow-lg scale-105 border border-orange-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                type="button"
                className={`flex-1 py-3.5 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
                  !isLogin
                    ? "bg-white text-orange-600 shadow-lg scale-105 border border-orange-100"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              {!isLogin && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/80"
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/80"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                </div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/80"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 bg-white/70 backdrop-blur-sm hover:bg-white/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center z-10 hover:scale-110 transition-transform duration-200"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors duration-200" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-orange-500 transition-colors duration-200" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white py-4 px-6 rounded-2xl font-bold text-lg hover:from-orange-600 hover:via-red-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      {isLogin ? "Signing In..." : "Creating Account..."}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {isLogin ? "Sign In & Start Cooking" : "Join the Kitchen"}
                      <ChefHat className="w-5 h-5 ml-2 group-hover:animate-bounce" />
                    </div>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegisterPage;
