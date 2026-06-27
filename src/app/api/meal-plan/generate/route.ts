import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js' // Using the clean, universal direct wrapper to isolate runtime environment bugs
import { calculateCookedRecipeNutrition } from '@/lib/nutritionEngine'
import { IFCTIngredient, Recipe } from '@/lib/types'

// Fallback baseline credentials if standard global setup context slips
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function POST(request: NextRequest) {
  try {
    console.log("========== GEMINI REINFORCED REQUEST START ==========")
    
    // Safety check for Environment Variables
    if (!process.env.GEMINI_API_KEY) {
      console.error("CRITICAL ERROR: GEMINI_API_KEY environment variable is missing.");
      return NextResponse.json({ error: "Gemini API key is unconfigured on the server." }, { status: 500 });
    }

    const body = await request.json().catch(() => ({}));
    const {
      deficiencies = [],
      conditions = [],
      allergies = [],
      dietType = 'vegetarian',
      swapMealType = null, 
      currentMealName = null, 
    } = body;

    let allergyWarning = '';
    if (allergies && allergies.length > 0) {
      allergyWarning = `
CRITICAL SAFETY DIRECTIVE:
The user has severe medical allergies to: ${allergies.join(', ')}. 
YOU MUST NOT INCLUDE ANY OF THESE INGREDIENTS OR THEIR DERIVATIVES.`;
    }

    let prompt = `You are Noura's advanced Indian clinical dietitian AI, built strictly on top of the ICMR-NIN (2020) and IFCT 2017 standards.

USER HEALTH PROFILE:
- Diet type: ${dietType}
- Deficiencies: ${deficiencies ? deficiencies.join(', ') : 'None'}
- Conditions: ${conditions ? conditions.join(', ') : 'None'}
- Allergies: ${allergies ? allergies.join(', ') : 'None'}
${allergyWarning}

CLINICAL IMPLEMENTATION RULESET:
1. Every single ingredient provided in the array MUST be a raw edible item using its standard common culinary name from Indian baselines (e.g., "Paneer", "Whole Wheat Flour", "Spinach (Palak)", "Cow Milk", "Carrot").
2. You MUST prioritize whole foods explicitly dense in the user's focus metrics: ${deficiencies ? deficiencies.join(', ') : 'Nutrition Values'}.
3. Match your ingredient names EXACTLY to common Indian raw ingredients so our database can run exact structural matches.`

    if (swapMealType && currentMealName) {
      prompt += `
TASK: Swap ${swapMealType} ("${currentMealName}"). Generate EXACTLY 1 healthy alternative.
Return ONLY valid JSON matching this exact structure:
{
  "meals": [
    {
      "type": "${swapMealType}",
      "label": "${swapMealType}",
      "name": "Distinct Alternate Dish Name",
      "imageKeyword": "short dish name in english for image search",
      "ingredients": ["Paneer", "Spinach (Palak)"],
      "badges": ["B12 Optimized"],
      "benefits": "Profile rationale."
    }
  ]
}`;
    } else {
      prompt += `
TASK: Generate a full daily meal plan containing exactly 4 distinct meals (Breakfast, Lunch, Snack, Dinner).
Return ONLY valid JSON matching this exact structure:
{
  "meals": [
    { "type": "Breakfast", "label": "Breakfast", "name": "Dish Name", "imageKeyword": "poha", "ingredients": ["Whole Wheat Flour", "Spinach (Palak)"], "badges": ["Vitamin A"], "benefits": "Rationale matching guidelines." },
    { "type": "Lunch", "label": "Lunch", "name": "Dish Name", "imageKeyword": "dal", "ingredients": ["Whole Wheat Flour", "Carrot"], "badges": ["Vitamin K"], "benefits": "Rationale matching guidelines." },
    { "type": "Snack", "label": "Snack", "name": "Dish Name", "imageKeyword": "juice", "ingredients": ["Carrot"], "badges": ["Beta Carotene"], "benefits": "Rationale matching guidelines." },
    { "type": "Dinner", "label": "Dinner", "name": "Dish Name", "imageKeyword": "sabzi", "ingredients": ["Paneer", "Spinach (Palak)"], "badges": ["Easy Digestion"], "benefits": "Rationale matching guidelines." }
  ]
}`;
    }

    console.log("Calling Gemini Endpoint...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: swapMealType ? 0.75 : 0.3,
            maxOutputTokens: 2500,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API returned error code:", response.status, errorText);
      return NextResponse.json({ error: "Gemini remote engine rejected parameters" }, { status: 500 });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) return NextResponse.json({ error: "Gemini returned empty schema payload" }, { status: 500 });

    console.log("Gemini Output Received successfully.");
    const parsedGemini = JSON.parse(text);
    
    // Direct standalone initialization to completely bypass server/client path wrapper bugs
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const allIngredientsList: string[] = [];
    if (parsedGemini?.meals && Array.isArray(parsedGemini.meals)) {
      parsedGemini.meals.forEach((meal: any) => {
        if (meal && Array.isArray(meal.ingredients)) {
          allIngredientsList.push(...meal.ingredients);
        }
      });
    }
console.log("Querying Supabase database elements...");
    let dbIngredients: any[] = [];
    if (allIngredientsList.length > 0) {
      const { data: matchedRows, error: dbError } = await supabase
        .from('ifct_ingredients')
        .select('*')
        .in('name', allIngredientsList);
        
      if (dbError) {
        console.error("Supabase reference reading error context:", dbError);
      } else if (matchedRows) {
        dbIngredients = matchedRows;
      }
    }

    const lookup: Record<string, IFCTIngredient> = {};
    dbIngredients.forEach((row: any) => {
      lookup[row.name.toLowerCase()] = {
        id: row.id,
        name: row.name,
        foodGroup: row.food_group,
        moisture_g: Number(row.moisture_g || 0),
        protein_g: Number(row.protein_g || 0),
        fat_g: Number(row.fat_g || 0),
        carbs_g: Number(row.carbs_g || 0),
        energy_kcal: Number(row.energy_kcal || 0),
        vitamin_B12_mcg: Number(row.vitamin_b12_mcg || 0),
        vitamin_D_mcg: Number(row.vitamin_d_mcg || 0),
        phytate_mg: Number(row.phytate_mg || 0),
        iron_mg: Number(row.iron_mg || 0),
      };
    });

    const enrichedMeals = (parsedGemini.meals || []).map((meal: any) => {
      const recipeIngredients = (meal.ingredients || []).map((ingName: string) => ({
        ingredientId: ingName.toLowerCase(),
        rawWeightGrams: 100
      }));

      const mockRecipe: Recipe = {
        id: 'temp',
        name: meal.name,
        instructions: [],
        ingredients: recipeIngredients,
        yieldFactor: 1,
        b12RetentionFactor: 0.9,
        dRetentionFactor: 0.95
      };

      let calculatedMacros = null;
      try {
        calculatedMacros = calculateCookedRecipeNutrition(mockRecipe, lookup);
      } catch (err) {
        console.error("Error evaluating recipe nutrition algorithm inside calculation loop:", err);
      }

      return {
        ...meal,
        nutrients: {
          calories: calculatedMacros?.calories ?? 0,
          vitaminB12: calculatedMacros?.vitaminB12 ?? 0,
          vitaminD: calculatedMacros?.vitaminD ?? 0
        }
      };
    });

    console.log("========== GEMINI REINFORCED REQUEST END WITH SUCCESS ==========");
    return NextResponse.json({ meals: enrichedMeals });

  } catch (error: any) {
    console.error("CRITICAL BACKEND ROUTE CRASH DETECTED:", error);
    return NextResponse.json({ 
      error: "Backend processing error encountered.",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}