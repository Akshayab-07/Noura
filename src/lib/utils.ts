import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Something went wrong. Please try again.'
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const DEFICIENCY_COLORS: Record<string, string> = {
  'B12': '#a43947',
  'Iron': '#c59f76',
  'Vitamin D': '#635882',
  'Calcium': '#ff7e8b',
  'Folate': '#dbcdfe',
  'Magnesium': '#c59f76',
  'Zinc': '#fee9e9',
  'Vitamin C': '#fff0f0',
  'Omega 3': '#f8e3e4',
}

export const SCORE_COLOR = (score: number) => {
  if (score >= 70) return 'text-green-600'
  if (score >= 40) return 'text-yellow-600'
  return 'text-red-600'
}

export const SCORE_BG = (score: number) => {
  if (score >= 70) return 'bg-green-100'
  if (score >= 40) return 'bg-yellow-100'
  return 'bg-red-100'
}

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
export const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export const DAILY_INGREDIENTS = [
  { name: 'Spinach', emoji: '🥬', fixes: ['Iron', 'Folate'], tips: ['Add to dal', 'Make palak paneer', 'Blend into smoothie'] },
  { name: 'Eggs', emoji: '🥚', fixes: ['B12', 'Vitamin D'], tips: ['Boil for breakfast', 'Make egg curry', 'Scramble with veggies'] },
  { name: 'Milk', emoji: '🥛', fixes: ['Calcium', 'B12'], tips: ['Drink warm at night', 'Make curd/dahi', 'Add to oatmeal'] },
  { name: 'Banana', emoji: '🍌', fixes: ['Magnesium', 'Vitamin C'], tips: ['Morning snack', 'Banana milkshake', 'Add to poha'] },
  { name: 'Tomato', emoji: '🍅', fixes: ['Vitamin C', 'Folate'], tips: ['Add to every sabzi', 'Make chutney', 'Eat raw in salad'] },
  { name: 'Sesame Seeds', emoji: '🌾', fixes: ['Calcium', 'Zinc'], tips: ['Sprinkle on salad', 'Add to roti dough', 'Make chikki'] },
  { name: 'Walnuts', emoji: '🌰', fixes: ['Omega 3', 'Magnesium'], tips: ['Morning snack', 'Add to salad', 'Mix with dahi'] },
  { name: 'Lentils', emoji: '🫘', fixes: ['Iron', 'Folate', 'B12'], tips: ['Make dal', 'Sprout for snack', 'Add to soup'] },
]
