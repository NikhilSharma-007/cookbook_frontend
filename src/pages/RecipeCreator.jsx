import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  ChefHat,
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  X,
  Save,
} from "lucide-react";
import { useCreateRecipe } from "../hooks/useRecipe";
import TiptapEditor from "../ui/Tiptapeditor";

const RecipeCreator = () => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [instructionsContent, setInstructionsContent] = useState("");
  const navigate = useNavigate();

  const createRecipeMutation = useCreateRecipe();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      instructions: "",
      ingredients: [{ name: "", quantity: "", unit: "" }],
      thumbnailImage: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  // Update form value when instructions content changes
  useEffect(() => {
    setValue("instructions", instructionsContent);
  }, [instructionsContent, setValue]);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setValue("thumbnailImage", file);
      const reader = new FileReader();
      reader.onload = (e) => setThumbnailPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = () => {
    setValue("thumbnailImage", null);
    setThumbnailPreview(null);
    document.getElementById("thumbnail-input").value = "";
  };

  const addIngredient = () => {
    append({ name: "", quantity: "", unit: "" });
  };

  const removeIngredient = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (!data.thumbnailImage) {
        alert("Please upload a recipe photo");
        return;
      }

      if (!data.instructions.trim() || data.instructions === "<p></p>") {
        alert("Please provide cooking instructions");
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("instructions", data.instructions);
      formData.append("ingredients", JSON.stringify(data.ingredients));
      formData.append("thumbnailImage", data.thumbnailImage);

      await createRecipeMutation.mutateAsync(formData);

      // Navigate back to home on success
      navigate("/home");
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  const commonUnits = [
    "cup",
    "cups",
    "tbsp",
    "g",
    "kg",
    "ml",
    "l",
    "piece",
    "pieces",
    "slice",
    "slices",
    "to taste",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <ChefHat className="w-8 h-8 text-orange-500" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Create Recipe
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Name *
              </label>
              <input
                type="text"
                {...register("name", {
                  required: "Recipe name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter recipe name..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipe Photo *
              </label>

              {!thumbnailPreview ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-400 transition-colors">
                  <input
                    id="thumbnail-input"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="thumbnail-input"
                    className="cursor-pointer flex flex-col items-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload recipe photo
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG up to 5MB
                    </span>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={thumbnailPreview}
                    alt="Recipe thumbnail"
                    className="w-full h-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {errors.thumbnailImage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.thumbnailImage.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Ingredients *
                </label>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="flex items-center space-x-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Ingredient</span>
                </button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input
                        type="text"
                        {...register(`ingredients.${index}.name`, {
                          required: "Ingredient name is required",
                        })}
                        placeholder="e.g., All-purpose flour"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                      />
                      {errors.ingredients?.[index]?.name && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.ingredients[index].name.message}
                        </p>
                      )}
                    </div>

                    <div className="w-24">
                      <input
                        type="text"
                        {...register(`ingredients.${index}.quantity`, {
                          required: "Quantity required",
                        })}
                        placeholder="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                      />
                      {errors.ingredients?.[index]?.quantity && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.ingredients[index].quantity.message}
                        </p>
                      )}
                    </div>

                    <div className="w-20">
                      <select
                        {...register(`ingredients.${index}.unit`, {
                          required: "Unit required",
                        })}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
                      >
                        <option value="">Unit</option>
                        {commonUnits.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                      {errors.ingredients?.[index]?.unit && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.ingredients[index].unit.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      disabled={fields.length === 1}
                      className="p-2 text-red-500 hover:text-red-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions *
              </label>
              <TiptapEditor
                content={instructionsContent}
                setContent={setInstructionsContent}
              />
              <input
                type="hidden"
                {...register("instructions", {
                  required: "Instructions are required",
                  validate: (value) =>
                    (value.trim() !== "<p></p>" && value.trim() !== "") ||
                    "Instructions cannot be empty",
                })}
              />
              {errors.instructions && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.instructions.message}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={createRecipeMutation.isPending}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>
                  {createRecipeMutation.isPending
                    ? "Creating..."
                    : "Create Recipe"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RecipeCreator;
