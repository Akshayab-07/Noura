# Noura — Product Requirements Document (PRD)
**Version:** 1.0  
**Stack:** React + Next.js + Supabase + Tailwind CSS  
**AI API:** Gemini (Free Tier)  
**Design:** Google Stitch (connected via MCP)

---

## 1. What Is Noura?

Noura is an AI-powered personalized nutrition web app that helps users fix vitamin and mineral deficiencies through Indian meal plans.

Most nutrition apps give generic advice. Noura is different — it remembers the user's specific deficiencies, conditions, and diet type, generates a personalized weekly Indian meal plan using AI, and tracks whether the user is consistently eating the right foods over time.

**Core value:** "Most apps ask what's wrong with you. Noura figures it out."

---

## 2. Target Users

- People who have been diagnosed with vitamin or mineral deficiencies (B12, Iron, Vitamin D, etc.)
- People who feel symptoms (tiredness, hair fall, weakness) but don't know their exact deficiency
- Indians who want meal plans using local, affordable ingredients
- People who want a simple tracker — not a complex calorie counter

---

## 3. Design Guidelines

- **Primary:** Soft Pink (#FF8FA3), Coral Red (#FF6B6B)
- **Secondary:** Peach (#FFD6A5), Mint Green (#A8E6CF)
- **Accent:** Banana Yellow (#FFE66D)
- **Feel:** Fresh, friendly, healthy — NOT medical, NOT dark, NOT intimidating
- **UI elements:** Rounded cards, soft shadows, fruit illustrations in backgrounds
- Match Stitch design exactly for all colors, layouts, and components

---

## 4. Pages & Features

---

### 4.1 Landing Page

**Sections:**

**Hero**
- Headline: "AI Nutrition Planner Built Around YOUR Deficiencies"
- Subheadline: "Fix Vitamin D, B12, Iron and more with personalized Indian meal plans"
- CTA buttons: [Get Started] [Learn More]
- Background: floating fruit/vegetable illustrations (oranges, spinach, tomatoes)

**Problem Section**
- 4 cards: Vitamin Deficiencies / Don't Know What To Eat / No Way To Track Progress / Forget Supplements

**How It Works**
- 4 large step cards:
  1. Tell Us About Yourself
  2. AI Builds Your Plan
  3. Track Daily
  4. Improve Over Time

**Testimonials**
- 3 fake demo cards for design purposes

**CTA Section**
- Large pink section: "Ready to fix your nutrition?" + [Start Free] button

---

### 4.2 Auth Pages

**Login Page**
- Left side: fruit/healthy bowl illustration
- Right side: card with Email + Password fields + [Login] button + Google OAuth
- Link to signup page

**Signup Page**
- Fields: Name, Email, Password
- Diet Type: radio — Vegetarian / Non-Vegetarian
- [Create Account] button
- After signup → redirect to Onboarding

---

### 4.3 Onboarding Flow (3 Steps)

**Step 1 — Do you know your deficiencies?**
- Two options: [Yes, I know them] [No, show me symptoms]

  **If YES:**
  - Checkbox grid of all deficiencies from database
  - B12, Vitamin D, Iron, Calcium, Folate, Magnesium, Zinc, Vitamin C, Omega 3

  **If NO — Symptom Questionnaire:**
  - Show max 5 symptom options as tap-to-select cards:
    - Tired often
    - Hair fall
    - Muscle weakness
    - Frequent illness
    - Low energy
    - Pale skin
    - Bone pain
    - Poor concentration
    - Mood swings
    - Slow healing wounds
  - After selecting → call Gemini API to infer likely deficiencies
  - Show result: "Based on your symptoms, you may have: Iron, B12, Vitamin D"
  - Always show disclaimer: "⚠️ This is not medical advice. Please confirm with a doctor."
  - Buttons: [Looks right, continue] [Let me edit this]

**Step 2 — Any other conditions?**
- Checkbox grid: High Cholesterol, Gut Issues, Anaemia, PCOS, Thyroid, Diabetes, General Weakness
- Optional — user can skip

**Step 3 — Any allergies?**
- Checkbox grid: Lactose Intolerant, Gluten Intolerant, Nut Allergy, Egg Allergy, Soy Allergy
- Optional — user can skip
- [Finish Setup] button → save all to Supabase → redirect to Dashboard

---

### 4.4 Dashboard

**Navbar**
- Logo (Noura)
- Links: Dashboard / Meal Plan / Progress / Recipes / Grocery List / Reminders / Settings
- User avatar top right

**Top Section**
- "Good Morning [Name] 👋"
- Streak display: "You're on a 7 day streak 🔥"

**Health Summary Cards (4 cards)**
- One card per top deficiency
- Shows deficiency name, icon, and Nutrition Score percentage
- Color coded by score (green = good, yellow = medium, red = low)

**Today's Meals**
- Large card with Breakfast / Lunch / Dinner / Snack
- Each meal shows: dish name, ingredient list, deficiency badges
- Checkbox: [Mark as Completed]
- On check → update daily_logs in Supabase → recalculate Nutrition Score

**Deficiency Progress Rings**
- Circular ring chart per deficiency
- Fills up based on Nutrition Score
- Looks premium — use a ring/donut chart component

**AI Assistant Button**
- Floating pink circular button bottom right on ALL pages
- Opens chat panel
- User types: "I feel tired today"
- AI responds: "Your Iron is low. Try today's spinach dal for lunch."
- Powered by Gemini API

---

### 4.5 Meal Plan Page

**Weekly View**
- 7 columns (Monday to Sunday)
- Each column shows: Breakfast, Lunch, Dinner, Snack
- Each meal card shows: dish name + deficiency badges
- [Swap Meal] button on each meal → AI generates alternative
- [Regenerate Week] button top right → AI regenerates entire week

**Meal Generation Logic (Gemini API)**

Prompt structure to send to Gemini:
```
User profile:
- Deficiencies: [list]
- Conditions: [list]
- Allergies: [list]
- Diet type: vegetarian/non-vegetarian

Generate a 7-day Indian meal plan with breakfast, lunch, dinner, and snack for each day.
For each meal provide:
- Dish name
- Key ingredients
- Which deficiency it helps (from user's list only)
- Simple preparation instructions

Return as JSON only.
```

---

### 4.6 Recipes Page

**Layout:** Pinterest-style grid

**Each Recipe Card shows:**
- Dish name
- Deficiency badges it helps
- Prep time
- Ingredients list
- Click → opens full recipe modal with step by step instructions

**Filter bar at top:**
- Filter by deficiency: [All] [B12] [Iron] [Vitamin D] etc.
- Filter by meal type: [All] [Breakfast] [Lunch] [Dinner] [Snack]
- Filter by diet: [All] [Vegetarian] [Non-Vegetarian]

---

### 4.7 Progress Page

**Weekly Calendar**
- M T W T F S S with tick/cross for each day

**Line Charts (one per deficiency)**
- Nutrition Score trend over past 4 weeks
- Use Recharts library

**Achievements Section**
- 🏆 First Week Completed
- 🔥 7 Day Streak
- 🥗 50 Healthy Meals Logged
- 💊 Supplements Taken 30 Days
- Cards unlock when milestone is hit

---

### 4.8 Grocery List Page

**Auto-generated from current week's meal plan**

**Layout:**
- List of all ingredients needed for the week
- Each item has a checkbox to tick while shopping
- No prices, no budget info — ingredients and quantity only

**Example:**
```
☐ Eggs × 6
☐ Spinach × 2 bundles
☐ Banana × 4
☐ Milk × 1 litre
☐ Whole wheat bread × 1 loaf
```

- [Regenerate List] button → pulls fresh from current meal plan

---

### 4.9 Reminders Page

**Cards for each reminder:**
```
Vitamin D Tablet
8:00 AM
[Mark Done]
```

**Add Reminder button:**
- Title, time, type (supplement / meal / water / custom)

**Types:**
- Supplement reminders
- Meal reminders
- Water reminders

---

### 4.10 Settings Page

- Edit name
- Edit diet type
- Edit deficiencies
- Edit conditions
- Edit allergies
- Edit reminder times
- Logout button

---

### 4.11 Ingredient Spotlight (Dashboard widget)

- One ingredient highlighted daily
- Example: "Today: Spinach 🥬 — Fixes Iron + Folate. Here are 3 quick ways to eat it."
- Rotates daily automatically

---

## 5. AI Integration (Gemini Free Tier)

**Use Gemini for:**
1. Symptom → deficiency inference (onboarding)
2. Weekly meal plan generation
3. Swap meal suggestion
4. Regenerate week
5. AI assistant chat responses

**All Gemini calls go through a Next.js API route** — never expose API key on frontend.

API route: `/api/gemini`

---

## 6. Database (Supabase)

**Tables already created:**
- users
- deficiencies (seeded)
- user_deficiencies
- conditions (seeded)
- user_conditions
- symptoms (seeded)
- user_symptoms
- allergies (seeded)
- user_allergies
- recipes
- recipe_benefits
- meal_plans
- meals
- daily_logs
- progress
- streaks
- reminders
- grocery_lists
- grocery_items

**Auth:** Supabase built-in auth (email + Google OAuth)

**Row Level Security:** already enabled — users only see their own data

---

## 7. Nutrition Score Logic

- NOT real blood levels
- Calculated based on meal completion consistency
- Formula: for each deficiency, check how many meals targeting it were completed this week vs total planned
- Score = (completed deficiency meals / total deficiency meals) × 100
- Resets partially each week — not fully, so progress feels cumulative

---

## 8. Streak Logic

- Streak increments if user logs at least one meal per day
- Stored in `streaks` table
- Resets to 0 if user misses a full day
- Longest streak is always preserved

---

## 9. Error Handling

- All errors shown in plain English — no technical jargon
- Examples:
  - "Couldn't load your meal plan. Please refresh."
  - "Login failed. Check your email and password."
  - "AI is taking too long. Try again in a moment."
- Loading states on all AI calls (Gemini can be slow)
- Empty states with illustrations — never a blank white screen

---

## 10. Mobile Responsiveness

- All pages fully responsive
- Navbar collapses to hamburger menu on mobile
- Cards stack vertically on small screens
- Touch friendly tap targets (min 44px)

---

## 11. Build Order (Phases)

**Phase 1 — Core (build first)**
1. Landing Page
2. Auth (Login + Signup)
3. Onboarding Flow
4. Dashboard
5. Meal Plan Page

**Phase 2 — Tracking**
6. Daily meal logging
7. Nutrition Score calculation
8. Progress Page

**Phase 3 — Extra Features**
9. Recipes Page
10. Grocery List
11. Reminders
12. AI Assistant floating button

**Phase 4 — Polish**
13. Ingredient Spotlight
14. Achievements
15. Streak system
16. Settings Page

---

## 12. Important Notes for Builder

- Never show budget, price, or cost anywhere in the app
- Always show medical disclaimer on any AI health suggestion
- Nutrition Score is a consistency tracker — never claim it represents actual blood levels
- Indian food context — meal plans should use Indian dishes (dal, roti, idli, eggs, sabzi, etc.)
- Keep onboarding under 3 minutes — no long forms
- Gemini responses must always be parsed as JSON for meal plans
- If Gemini fails, show a friendly error and a retry button — never crash

---

*End of PRD — Noura v1.0*
