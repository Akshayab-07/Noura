// 1. Raw IFCT Base Ingredient Standardized to 100g
export interface IFCTIngredient {
  id: string;
  name: string;
  foodGroup: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O';
  moisture_g: number;
  protein_g: number;
  fat_g: number;
  carbs_g: number;
  energy_kcal: number;
  vitamin_B12_mcg: number;
  vitamin_D_mcg: number;
  phytate_mg: number; // For bioavailability calculations
  iron_mg: number;
}

// 2. Recipe Ingredient Mapping (Tracks raw weight used in a composite meal)
export interface RecipeIngredient {
  ingredientId: string;
  rawWeightGrams: number; 
}

// 3. Composite Recipe Object (Powers the Recipes Page)
export interface Recipe {
  id: string;
  name: string;
  instructions: string[];
  ingredients: RecipeIngredient[];
  yieldFactor: number;        // e.g., 2.5 if volume expands when cooked
  b12RetentionFactor: number; // e.g., 0.90 (10% thermal loss)
  dRetentionFactor: number;   // e.g., 0.95 (5% thermal loss)
}

// 4. Calendar Meal Plan Element (Powers Dashboard & Meal Plan Page)
export interface ScheduledMeal {
  id: string;
  recipeId: string;
  slot: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  date: string; // YYYY-MM-DD
  isCompleted: boolean;
}