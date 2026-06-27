import { NextRequest, NextResponse } from 'next/server'
import { getDailyMealPlan, getAlternativeMeal, type UserProfile } from '@/lib/mealData'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      deficiencies = [],
      conditions = [],
      allergies = [],
      dietType = 'vegetarian',
      swapMealType = null,
      currentMealId = null,
    } = body

    const profile: UserProfile = {
      deficiencies,
      conditions,
      allergies,
      dietType,
    }

    // Swap meal request
    if (swapMealType && currentMealId) {
      const alternative = getAlternativeMeal(currentMealId, swapMealType, profile)
      return NextResponse.json({ meals: [alternative] })
    }

    // Full daily meal plan
    const plan = getDailyMealPlan(profile)
    const meals = [plan.breakfast, plan.lunch, plan.snack, plan.dinner]

    return NextResponse.json({ meals })

  } catch (error: any) {
    console.error('Meal plan route error:', error)
    return NextResponse.json(
      { error: 'Could not generate meal plan. Please try again.' },
      { status: 500 }
    )
  }
}