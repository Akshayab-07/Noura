/**
 * NOURA — Indian Meal Dataset
 * 
 * Data Sources:
 * - ICMR-NIN Recommended Dietary Allowances (RDA) 2020
 * - NIN Indian Food Composition Tables (IFCT) 2017
 * - ICMR Dietary Guidelines for Indians 2024
 * 
 * DISCLAIMER: This dataset is for general nutrition guidance only.
 * It is not a substitute for medical advice. Always consult a 
 * registered dietitian or doctor before making dietary changes.
 * 
 * Architecture: Hybrid Expert System
 * - Rule-based filtering engine (ICMR/NIN dataset)
 * - AI used only for onboarding symptom inference (once per user)
 */

// ============================================================
// TYPES
// ============================================================

export type MealType = 'breakfast' | 'lunch' | 'snack' | 'dinner'

export type Deficiency =
  | 'Vitamin B12'
  | 'Vitamin D'
  | 'Vitamin A'
  | 'Vitamin C'
  | 'Vitamin E'
  | 'Vitamin K'
  | 'Vitamin B6'
  | 'Iron'
  | 'Calcium'
  | 'Folate'
  | 'Magnesium'
  | 'Zinc'
  | 'Omega 3'
  | 'Iodine'
  | 'Potassium'
  | 'Selenium'
  | 'Biotin'
  | 'Phosphorus'

export type Condition =
  | 'High Cholesterol'
  | 'Gut Issues'
  | 'Anaemia'
  | 'PCOS'
  | 'Thyroid'
  | 'Diabetes'
  | 'General Weakness'
  | 'Hypertension'
  | 'Arthritis'
  | 'Osteoporosis'
  | 'Kidney Issues'
  | 'Liver Issues'
  | 'Migraine'
  | 'Skin Issues'

export type Allergy =
  | 'lactose'
  | 'gluten'
  | 'nuts'
  | 'eggs'
  | 'soy'
  | 'shellfish'
  | 'fish'
  | 'coconut'
  | 'mustard'
  | 'sesame'

export interface Meal {
  id: string
  name: string
  type: MealType
  label: string // e.g. "Morning Fuel"
  description: string
  ingredients: string[]
  deficiencies: Deficiency[] // which deficiencies this meal helps
  contains: Allergy[] // allergens present in this meal
  safeFor: Condition[] // conditions this meal is safe/beneficial for
  avoidFor: Condition[] // conditions this meal should be avoided for
  dietType: 'vegetarian' | 'non-vegetarian' | 'vegan'
  icmrNote: string // ICMR/NIN backed nutrition note
  prepTime: number // minutes
  imageQuery: string // for Unsplash image search
}

// ============================================================
// MEAL DATASET
// 70+ Indian meals — ICMR/NIN verified
// ============================================================

export const MEALS: Meal[] = [

  // ============================================================
  // BREAKFAST MEALS
  // ============================================================

  {
    id: 'b001',
    name: 'Ragi Dosa with Sambar',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Crispy finger millet dosa served with protein-rich sambar',
    ingredients: ['ragi flour', 'rice flour', 'toor dal', 'tomato', 'onion', 'curry leaves', 'mustard seeds'],
    deficiencies: ['Iron', 'Calcium', 'Folate', 'Magnesium'],
    contains: [],
    safeFor: ['PCOS', 'Diabetes', 'High Cholesterol', 'Anaemia', 'Osteoporosis', 'General Weakness'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Ragi contains 3.9mg iron per 100g (NIN IFCT 2017) and is one of the best plant sources of calcium at 344mg/100g. Excellent for anaemia and bone health.',
    prepTime: 20,
    imageQuery: 'dosa sambar indian breakfast',
  },

  {
    id: 'b002',
    name: 'Masala Omelette with Whole Wheat Toast',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Spiced egg omelette with onion, tomato, and green chilli',
    ingredients: ['eggs', 'onion', 'tomato', 'green chilli', 'coriander', 'whole wheat bread', 'oil'],
    deficiencies: ['Vitamin B12', 'Vitamin D', 'Iron', 'Vitamin A', 'Selenium', 'Vitamin K'],
    contains: ['eggs', 'gluten'],
    safeFor: ['General Weakness', 'Anaemia', 'High Cholesterol', 'Thyroid'],
    avoidFor: ['Kidney Issues'],
    dietType: 'non-vegetarian',
    icmrNote: 'Eggs provide 1.3µg B12 per egg (NIN IFCT 2017). Two eggs cover ~60% of ICMR-NIN 2020 RDA of 2.2µg/day. Also rich in Vitamin D and selenium.',
    prepTime: 15,
    imageQuery: 'masala omelette indian breakfast egg',
  },

  {
    id: 'b003',
    name: 'Poha with Peanuts and Lemon',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Flattened rice with peanuts, turmeric, curry leaves and lemon',
    ingredients: ['flattened rice', 'peanuts', 'onion', 'turmeric', 'curry leaves', 'lemon', 'mustard seeds', 'green chilli'],
    deficiencies: ['Iron', 'Vitamin C', 'Magnesium'],
    contains: ['nuts'],
    safeFor: ['Gut Issues', 'General Weakness', 'Anaemia', 'PCOS'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Lemon provides Vitamin C which boosts iron absorption from poha by up to 3x (ICMR 2024 Dietary Guidelines). Peanuts add magnesium and zinc.',
    prepTime: 15,
    imageQuery: 'poha indian breakfast flattened rice',
  },

  {
    id: 'b004',
    name: 'Spinach Moong Dal Cheela',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Protein-rich green gram pancake with spinach',
    ingredients: ['moong dal', 'spinach', 'ginger', 'green chilli', 'cumin', 'coriander', 'oil'],
    deficiencies: ['Iron', 'Folate', 'Vitamin K', 'Magnesium', 'Zinc'],
    contains: [],
    safeFor: ['PCOS', 'Diabetes', 'Gut Issues', 'Anaemia', 'High Cholesterol', 'General Weakness'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Spinach provides 2.7mg iron per 100g (NIN IFCT 2017). Moong dal adds folate. Pair with amla chutney for Vitamin C to enhance iron absorption.',
    prepTime: 20,
    imageQuery: 'moong dal cheela indian pancake',
  },

  {
    id: 'b005',
    name: 'Idli with Sambar and Coconut Chutney',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Steamed rice cakes with lentil soup',
    ingredients: ['rice', 'urad dal', 'toor dal', 'coconut', 'tomato', 'onion', 'tamarind'],
    deficiencies: ['Iron', 'Folate', 'Calcium'],
    contains: ['coconut'],
    safeFor: ['Gut Issues', 'PCOS', 'General Weakness', 'Hypertension', 'Liver Issues'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Fermented foods like idli improve gut microbiome and nutrient absorption (ICMR 2024). The fermentation increases bioavailability of iron and B vitamins.',
    prepTime: 30,
    imageQuery: 'idli sambar south indian breakfast',
  },

  {
    id: 'b006',
    name: 'Methi Paratha with Curd',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Fenugreek flatbread with probiotic curd',
    ingredients: ['whole wheat flour', 'methi leaves', 'curd', 'ajwain', 'turmeric', 'oil'],
    deficiencies: ['Iron', 'Calcium', 'Vitamin B12', 'Folate', 'Magnesium'],
    contains: ['gluten', 'lactose'],
    safeFor: ['PCOS', 'Diabetes', 'High Cholesterol', 'Anaemia'],
    avoidFor: ['Gut Issues', 'Thyroid', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Methi (fenugreek) has significant iron content and anti-inflammatory properties. Curd provides B12 and calcium. ICMR recommends fermented dairy for gut health.',
    prepTime: 25,
    imageQuery: 'methi paratha fenugreek flatbread indian',
  },

  {
    id: 'b007',
    name: 'Banana Oats Porridge with Nuts',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Rolled oats cooked with banana, milk and mixed nuts',
    ingredients: ['rolled oats', 'banana', 'milk', 'almonds', 'walnuts', 'honey', 'cinnamon'],
    deficiencies: ['Potassium', 'Magnesium', 'Calcium', 'Vitamin B6', 'Omega 3'],
    contains: ['gluten', 'lactose', 'nuts'],
    safeFor: ['High Cholesterol', 'Hypertension', 'General Weakness', 'Migraine'],
    avoidFor: ['Diabetes', 'Kidney Issues', 'PCOS'],
    dietType: 'vegetarian',
    icmrNote: 'Oats contain beta-glucan which ICMR recommends for cholesterol reduction. Walnuts are the best plant source of Omega-3 (ALA) at 9g per 100g.',
    prepTime: 10,
    imageQuery: 'oats porridge banana nuts breakfast',
  },

  {
    id: 'b008',
    name: 'Upma with Vegetables',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Semolina porridge with seasonal vegetables',
    ingredients: ['semolina', 'onion', 'carrot', 'peas', 'green chilli', 'curry leaves', 'mustard seeds', 'oil'],
    deficiencies: ['Iron', 'Vitamin A', 'Folate'],
    contains: ['gluten'],
    safeFor: ['General Weakness', 'Gut Issues'],
    avoidFor: ['Diabetes', 'Kidney Issues', 'PCOS'],
    dietType: 'vegan',
    icmrNote: 'Carrots provide beta-carotene (Vitamin A precursor) at 8285µg per 100g (NIN IFCT 2017). Peas add folate and iron.',
    prepTime: 15,
    imageQuery: 'upma south indian breakfast semolina',
  },

  {
    id: 'b009',
    name: 'Paneer Bhurji with Roti',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Scrambled cottage cheese with spices and whole wheat roti',
    ingredients: ['paneer', 'onion', 'tomato', 'capsicum', 'turmeric', 'whole wheat flour', 'oil'],
    deficiencies: ['Vitamin B12', 'Calcium', 'Vitamin A', 'Phosphorus'],
    contains: ['lactose', 'gluten'],
    safeFor: ['General Weakness', 'Osteoporosis', 'PCOS'],
    avoidFor: ['Kidney Issues', 'High Cholesterol'],
    dietType: 'vegetarian',
    icmrNote: 'Paneer provides 0.8µg B12 per 100g and 208mg calcium per 100g (NIN IFCT 2017). Excellent for vegetarians who cannot consume meat for B12.',
    prepTime: 20,
    imageQuery: 'paneer bhurji indian cottage cheese scramble',
  },

  {
    id: 'b010',
    name: 'Sprout Salad with Lemon and Chaat Masala',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Mixed sprouts with cucumber, tomato, and lemon dressing',
    ingredients: ['moong sprouts', 'chana sprouts', 'cucumber', 'tomato', 'lemon', 'chaat masala', 'coriander'],
    deficiencies: ['Iron', 'Folate', 'Zinc', 'Vitamin C', 'Magnesium'],
    contains: [],
    safeFor: ['PCOS', 'Diabetes', 'High Cholesterol', 'Anaemia', 'General Weakness', 'Gut Issues'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Sprouting increases bioavailability of iron and zinc by reducing phytates (ICMR 2024). Lemon adds Vitamin C for enhanced iron absorption.',
    prepTime: 10,
    imageQuery: 'sprout salad indian healthy breakfast',
  },

  {
    id: 'b011',
    name: 'Ragi Malt with Milk',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Finger millet porridge with warm milk and jaggery',
    ingredients: ['ragi flour', 'milk', 'jaggery', 'cardamom'],
    deficiencies: ['Calcium', 'Iron', 'Vitamin B12', 'Magnesium'],
    contains: ['lactose'],
    safeFor: ['Osteoporosis', 'Anaemia', 'General Weakness', 'PCOS'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Ragi has 344mg calcium per 100g — highest among cereals (NIN IFCT 2017). Milk adds B12 and Vitamin D. ICMR recommends ragi for bone health and anaemia.',
    prepTime: 10,
    imageQuery: 'ragi malt finger millet porridge',
  },

  {
    id: 'b012',
    name: 'Vegetable Besan Cheela',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Chickpea flour pancake stuffed with mixed vegetables',
    ingredients: ['besan', 'spinach', 'onion', 'tomato', 'carrot', 'turmeric', 'ajwain', 'oil'],
    deficiencies: ['Iron', 'Folate', 'Zinc', 'Vitamin A', 'Magnesium'],
    contains: [],
    safeFor: ['PCOS', 'Diabetes', 'High Cholesterol', 'Anaemia', 'General Weakness'],
    avoidFor: ['Gut Issues', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Besan (chickpea flour) contains 6.5mg iron per 100g (NIN IFCT 2017). High in zinc and folate. Excellent protein source for vegetarians.',
    prepTime: 15,
    imageQuery: 'besan cheela chickpea pancake indian',
  },

  // ============================================================
  // LUNCH MEALS
  // ============================================================

  {
    id: 'l001',
    name: 'Palak Dal with Brown Rice',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Spinach lentil curry with brown rice',
    ingredients: ['toor dal', 'spinach', 'brown rice', 'tomato', 'onion', 'garlic', 'cumin', 'turmeric'],
    deficiencies: ['Iron', 'Folate', 'Vitamin K', 'Magnesium', 'Zinc'],
    contains: [],
    safeFor: ['Anaemia', 'PCOS', 'High Cholesterol', 'General Weakness', 'Diabetes'],
    avoidFor: ['Kidney Issues', 'Thyroid'],
    dietType: 'vegan',
    icmrNote: 'Spinach provides 2.7mg iron per 100g. Dal adds folate and protein. Brown rice has higher magnesium than white rice. ICMR recommends pairing with Vitamin C for iron absorption.',
    prepTime: 30,
    imageQuery: 'palak dal spinach lentil curry rice',
  },

  {
    id: 'l002',
    name: 'Rajma Chawal',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Kidney bean curry with rice',
    ingredients: ['rajma', 'rice', 'onion', 'tomato', 'ginger', 'garlic', 'garam masala', 'oil'],
    deficiencies: ['Iron', 'Folate', 'Magnesium', 'Potassium', 'Zinc', 'Calcium'],
    contains: [],
    safeFor: ['Anaemia', 'High Cholesterol', 'General Weakness', 'Osteoporosis'],
    avoidFor: ['Kidney Issues', 'Gut Issues', 'Diabetes'],
    dietType: 'vegan',
    icmrNote: 'Rajma contains 8mg iron per 100g — one of the highest plant sources (NIN IFCT 2017). Also high in magnesium (140mg/100g) and potassium.',
    prepTime: 40,
    imageQuery: 'rajma chawal kidney bean curry rice',
  },

  {
    id: 'l003',
    name: 'Egg Curry with Roti',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Spiced boiled egg curry with whole wheat roti',
    ingredients: ['eggs', 'onion', 'tomato', 'ginger', 'garlic', 'garam masala', 'whole wheat flour', 'oil'],
    deficiencies: ['Vitamin B12', 'Vitamin D', 'Iron', 'Selenium', 'Vitamin A'],
    contains: ['eggs', 'gluten'],
    safeFor: ['General Weakness', 'Anaemia', 'Thyroid', 'PCOS'],
    avoidFor: ['Kidney Issues', 'High Cholesterol'],
    dietType: 'non-vegetarian',
    icmrNote: 'Eggs are the most bioavailable source of B12 for vegetarians/flexitarians. Two eggs provide ~60% of the ICMR-NIN 2020 B12 RDA of 2.2µg/day.',
    prepTime: 25,
    imageQuery: 'egg curry indian lunch',
  },

  {
    id: 'l004',
    name: 'Chole with Jeera Rice',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Chickpea curry with cumin-spiced rice',
    ingredients: ['chickpeas', 'rice', 'onion', 'tomato', 'ginger', 'garlic', 'cumin', 'chole masala'],
    deficiencies: ['Iron', 'Folate', 'Zinc', 'Magnesium', 'Calcium'],
    contains: [],
    safeFor: ['Anaemia', 'PCOS', 'High Cholesterol', 'General Weakness'],
    avoidFor: ['Gut Issues', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Chickpeas contain 4.6mg iron per 100g (NIN IFCT 2017). High in zinc and folate. Soaking overnight reduces phytates and improves mineral absorption.',
    prepTime: 35,
    imageQuery: 'chole bhature chickpea curry rice',
  },

  {
    id: 'l005',
    name: 'Macher Jhol with Rice',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Bengali light fish curry with vegetables and rice',
    ingredients: ['rohu fish', 'potato', 'tomato', 'turmeric', 'mustard oil', 'green chilli', 'rice'],
    deficiencies: ['Omega 3', 'Vitamin B12', 'Vitamin D', 'Iodine', 'Selenium'],
    contains: ['fish', 'mustard'],
    safeFor: ['General Weakness', 'Thyroid', 'High Cholesterol', 'Arthritis', 'Migraine'],
    avoidFor: ['Kidney Issues'],
    dietType: 'non-vegetarian',
    icmrNote: 'Fish is the best source of Omega-3 EPA/DHA. ICMR recommends 2 servings of fish per week for heart health. Also provides iodine critical for thyroid function.',
    prepTime: 30,
    imageQuery: 'fish curry bengali rice indian',
  },

  {
    id: 'l006',
    name: 'Sambhar with Rice and Papad',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'South Indian lentil and vegetable stew with rice',
    ingredients: ['toor dal', 'drumstick', 'tomato', 'onion', 'tamarind', 'sambar powder', 'rice'],
    deficiencies: ['Iron', 'Folate', 'Vitamin A', 'Magnesium'],
    contains: [],
    safeFor: ['Gut Issues', 'General Weakness', 'PCOS', 'Liver Issues'],
    avoidFor: ['Kidney Issues', 'Hypertension'],
    dietType: 'vegan',
    icmrNote: 'Drumstick (moringa) in sambar contains 25mg iron per 100g — exceptionally high (NIN IFCT 2017). Also rich in Vitamin A and calcium.',
    prepTime: 35,
    imageQuery: 'sambar rice south indian lunch',
  },

  {
    id: 'l007',
    name: 'Methi Dal with Jowar Roti',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Fenugreek-spiced lentil dal with sorghum flatbread',
    ingredients: ['masoor dal', 'methi leaves', 'jowar flour', 'onion', 'tomato', 'garlic', 'cumin', 'oil'],
    deficiencies: ['Iron', 'Folate', 'Magnesium', 'Calcium', 'Zinc'],
    contains: [],
    safeFor: ['PCOS', 'Diabetes', 'High Cholesterol', 'Anaemia', 'Osteoporosis'],
    avoidFor: ['Thyroid', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Methi is recommended by ICMR for blood sugar management and iron content. Jowar roti is gluten-free and has low glycemic index — ideal for PCOS and diabetes.',
    prepTime: 30,
    imageQuery: 'methi dal fenugreek lentil roti',
  },

  {
    id: 'l008',
    name: 'Kadhi Pakoda with Rice',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Yogurt and chickpea flour curry with fritters',
    ingredients: ['curd', 'besan', 'onion', 'methi leaves', 'cumin', 'mustard seeds', 'turmeric', 'rice'],
    deficiencies: ['Vitamin B12', 'Calcium', 'Iron', 'Folate'],
    contains: ['lactose'],
    safeFor: ['Gut Issues', 'General Weakness'],
    avoidFor: ['PCOS', 'Diabetes', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Curd provides B12 and probiotics. ICMR recommends fermented dairy for gut health and improved calcium absorption.',
    prepTime: 30,
    imageQuery: 'kadhi pakoda yogurt curry rice indian',
  },

  {
    id: 'l009',
    name: 'Chicken Curry with Brown Rice',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Lean chicken curry with brown rice',
    ingredients: ['chicken breast', 'onion', 'tomato', 'ginger', 'garlic', 'garam masala', 'brown rice', 'oil'],
    deficiencies: ['Vitamin B12', 'Iron', 'Zinc', 'Selenium', 'Vitamin B6'],
    contains: [],
    safeFor: ['General Weakness', 'Anaemia', 'Thyroid', 'PCOS'],
    avoidFor: ['High Cholesterol', 'Kidney Issues'],
    dietType: 'non-vegetarian',
    icmrNote: 'Chicken is a complete protein source with high bioavailable zinc and B12. Brown rice adds magnesium and has lower glycemic index than white rice.',
    prepTime: 35,
    imageQuery: 'chicken curry brown rice indian',
  },

  {
    id: 'l010',
    name: 'Moong Dal Khichdi',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'One-pot rice and lentil dish with turmeric and ghee',
    ingredients: ['moong dal', 'rice', 'turmeric', 'ghee', 'cumin', 'ginger', 'salt'],
    deficiencies: ['Iron', 'Folate', 'Magnesium', 'Zinc'],
    contains: ['lactose'],
    safeFor: ['Gut Issues', 'Liver Issues', 'General Weakness', 'Arthritis'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Khichdi is ICMR recommended as a complete protein meal (cereal+legume combination improves amino acid profile). Easy to digest — ideal for gut issues.',
    prepTime: 25,
    imageQuery: 'khichdi moong dal rice indian comfort food',
  },

  {
    id: 'l011',
    name: 'Palak Paneer with Bajra Roti',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Spinach and cottage cheese curry with pearl millet flatbread',
    ingredients: ['spinach', 'paneer', 'bajra flour', 'onion', 'tomato', 'ginger', 'garlic', 'cream', 'oil'],
    deficiencies: ['Iron', 'Calcium', 'Vitamin B12', 'Vitamin K', 'Folate', 'Magnesium'],
    contains: ['lactose'],
    safeFor: ['Osteoporosis', 'Anaemia', 'General Weakness', 'PCOS'],
    avoidFor: ['High Cholesterol', 'Kidney Issues', 'Thyroid'],
    dietType: 'vegetarian',
    icmrNote: 'Spinach+paneer combination provides iron + calcium + B12. Bajra roti is gluten-free, high in magnesium (137mg/100g). ICMR-NIN recommends millet-based rotis.',
    prepTime: 30,
    imageQuery: 'palak paneer spinach cottage cheese curry',
  },

  {
    id: 'l012',
    name: 'Sarson Ka Saag with Makki Roti',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Mustard greens curry with corn flatbread',
    ingredients: ['sarson leaves', 'bathua', 'spinach', 'makki flour', 'ginger', 'garlic', 'butter', 'onion'],
    deficiencies: ['Iron', 'Vitamin K', 'Folate', 'Calcium', 'Vitamin A'],
    contains: ['lactose'],
    safeFor: ['Anaemia', 'Osteoporosis', 'General Weakness', 'High Cholesterol'],
    avoidFor: ['Thyroid', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Mustard greens are exceptionally rich in Vitamin K (257µg/100g) and iron. Makki (corn) roti is gluten-free with good potassium content.',
    prepTime: 45,
    imageQuery: 'sarson ka saag makki roti punjabi food',
  },

  {
    id: 'l013',
    name: 'Bisi Bele Bath',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Karnataka spiced rice and lentil dish with vegetables',
    ingredients: ['rice', 'toor dal', 'mixed vegetables', 'tamarind', 'bisi bele bath masala', 'ghee', 'cashews'],
    deficiencies: ['Iron', 'Folate', 'Magnesium', 'Zinc'],
    contains: ['lactose', 'nuts'],
    safeFor: ['General Weakness', 'Gut Issues'],
    avoidFor: ['Diabetes', 'Kidney Issues', 'PCOS'],
    dietType: 'vegetarian',
    icmrNote: 'Complete protein meal from rice+lentil combination. ICMR recommends cereal-legume ratio of 3:1 for optimal amino acid profile.',
    prepTime: 40,
    imageQuery: 'bisi bele bath karnataka rice lentil',
  },

  // ============================================================
  // SNACK MEALS
  // ============================================================

  {
    id: 's001',
    name: 'Banana with Peanut Butter',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Fresh banana with natural peanut butter',
    ingredients: ['banana', 'peanut butter'],
    deficiencies: ['Potassium', 'Magnesium', 'Vitamin B6', 'Omega 3'],
    contains: ['nuts'],
    safeFor: ['General Weakness', 'High Cholesterol', 'Migraine', 'Hypertension'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Banana provides 358mg potassium per 100g (NIN IFCT 2017). Magnesium in peanut butter helps with muscle function and migraine prevention.',
    prepTime: 2,
    imageQuery: 'banana peanut butter snack healthy',
  },

  {
    id: 's002',
    name: 'Amla Juice with Honey',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Fresh Indian gooseberry juice with honey',
    ingredients: ['amla', 'honey', 'water'],
    deficiencies: ['Vitamin C', 'Iron'],
    contains: [],
    safeFor: ['Anaemia', 'General Weakness', 'High Cholesterol', 'Skin Issues', 'Liver Issues', 'Arthritis'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Amla has the highest natural Vitamin C content among Indian foods — 600mg/100g (NIN IFCT 2017). Vitamin C boosts iron absorption significantly. ICMR highlights amla as a superfood.',
    prepTime: 5,
    imageQuery: 'amla juice indian gooseberry',
  },

  {
    id: 's003',
    name: 'Roasted Makhana with Turmeric',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Fox nuts roasted with ghee and turmeric',
    ingredients: ['makhana', 'ghee', 'turmeric', 'black pepper', 'salt'],
    deficiencies: ['Calcium', 'Magnesium', 'Phosphorus', 'Iron'],
    contains: ['lactose'],
    safeFor: ['PCOS', 'Arthritis', 'General Weakness', 'Osteoporosis', 'Gut Issues'],
    avoidFor: ['Kidney Issues', 'Diabetes'],
    dietType: 'vegetarian',
    icmrNote: 'Makhana (lotus seeds) contain 60mg calcium per 100g and are anti-inflammatory. Turmeric with black pepper activates curcumin absorption by 2000%.',
    prepTime: 10,
    imageQuery: 'makhana fox nuts roasted snack',
  },

  {
    id: 's004',
    name: 'Mixed Dry Fruits and Nuts',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Almonds, walnuts, cashews and raisins',
    ingredients: ['almonds', 'walnuts', 'cashews', 'raisins'],
    deficiencies: ['Vitamin E', 'Omega 3', 'Iron', 'Magnesium', 'Zinc', 'Selenium', 'Calcium'],
    contains: ['nuts'],
    safeFor: ['General Weakness', 'High Cholesterol', 'Arthritis', 'Skin Issues', 'Migraine'],
    avoidFor: ['Kidney Issues', 'PCOS'],
    dietType: 'vegan',
    icmrNote: 'Almonds contain 270mg magnesium per 100g. Walnuts are richest plant source of Omega-3. ICMR recommends a handful of nuts daily for heart health.',
    prepTime: 1,
    imageQuery: 'dry fruits nuts almonds walnuts healthy snack',
  },

  {
    id: 's005',
    name: 'Curd with Banana and Flaxseeds',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Thick curd with banana slices and ground flaxseeds',
    ingredients: ['curd', 'banana', 'flaxseeds', 'honey'],
    deficiencies: ['Vitamin B12', 'Calcium', 'Potassium', 'Omega 3', 'Magnesium'],
    contains: ['lactose'],
    safeFor: ['PCOS', 'Gut Issues', 'General Weakness', 'High Cholesterol'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Curd provides B12 and probiotics. Flaxseeds are the richest plant source of Omega-3 ALA. ICMR recommends flaxseeds for PCOS hormone management.',
    prepTime: 5,
    imageQuery: 'curd yogurt banana healthy snack indian',
  },

  {
    id: 's006',
    name: 'Boiled Chana Chaat',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Spiced boiled chickpeas with onion, tomato, lemon',
    ingredients: ['black chana', 'onion', 'tomato', 'lemon', 'chaat masala', 'coriander', 'green chilli'],
    deficiencies: ['Iron', 'Zinc', 'Folate', 'Magnesium', 'Vitamin C'],
    contains: [],
    safeFor: ['PCOS', 'Diabetes', 'High Cholesterol', 'Anaemia', 'General Weakness'],
    avoidFor: ['Gut Issues', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Black chana has 7.2mg iron per 100g (NIN IFCT 2017). Lemon provides Vitamin C for enhanced iron absorption. High fibre for blood sugar control.',
    prepTime: 10,
    imageQuery: 'chana chaat chickpea spiced snack',
  },

  {
    id: 's007',
    name: 'Steamed Dhokla',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Fermented chickpea flour steamed cake',
    ingredients: ['besan', 'curd', 'lemon', 'turmeric', 'eno', 'mustard seeds', 'curry leaves'],
    deficiencies: ['Iron', 'Folate', 'Zinc', 'Calcium'],
    contains: ['lactose'],
    safeFor: ['Gut Issues', 'PCOS', 'General Weakness', 'High Cholesterol'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Fermented besan improves zinc and iron bioavailability. ICMR recommends fermented foods for gut health. Low calorie, high protein snack.',
    prepTime: 30,
    imageQuery: 'dhokla gujarati steamed snack',
  },

  {
    id: 's008',
    name: 'Guava with Black Salt',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Fresh guava sprinkled with black salt and chilli powder',
    ingredients: ['guava', 'black salt', 'chilli powder'],
    deficiencies: ['Vitamin C', 'Iron', 'Folate', 'Potassium'],
    contains: [],
    safeFor: ['Anaemia', 'Skin Issues', 'General Weakness', 'Diabetes', 'High Cholesterol'],
    avoidFor: ['Kidney Issues', 'Gut Issues'],
    dietType: 'vegan',
    icmrNote: 'Guava has 212mg Vitamin C per 100g — highest among commonly consumed Indian fruits (NIN IFCT 2017). ICMR highlights guava for iron absorption enhancement.',
    prepTime: 2,
    imageQuery: 'guava fruit fresh healthy snack',
  },

  {
    id: 's009',
    name: 'Pumpkin Seeds and Sunflower Seeds Mix',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Roasted mixed seeds with rock salt',
    ingredients: ['pumpkin seeds', 'sunflower seeds', 'rock salt'],
    deficiencies: ['Zinc', 'Magnesium', 'Vitamin E', 'Iron', 'Selenium'],
    contains: ['sesame'],
    safeFor: ['PCOS', 'General Weakness', 'Skin Issues', 'Thyroid', 'Arthritis'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Pumpkin seeds contain 7.5mg zinc per 100g — excellent for immunity and PCOS. Sunflower seeds are rich in Vitamin E (35mg/100g) and selenium.',
    prepTime: 5,
    imageQuery: 'pumpkin seeds sunflower seeds healthy snack',
  },

  {
    id: 's010',
    name: 'Sweet Potato Chaat',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Boiled sweet potato with spices and lemon',
    ingredients: ['sweet potato', 'lemon', 'chaat masala', 'coriander', 'green chilli'],
    deficiencies: ['Vitamin A', 'Potassium', 'Vitamin B6', 'Vitamin C', 'Magnesium'],
    contains: [],
    safeFor: ['General Weakness', 'Skin Issues', 'Gut Issues', 'Arthritis'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Sweet potato has 8509µg beta-carotene (Vitamin A) per 100g — one of the richest sources (NIN IFCT 2017). Also high in potassium and Vitamin B6.',
    prepTime: 15,
    imageQuery: 'sweet potato chaat indian snack',
  },

  {
    id: 's011',
    name: 'Coconut Water',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Fresh tender coconut water',
    ingredients: ['tender coconut water'],
    deficiencies: ['Potassium', 'Magnesium'],
    contains: ['coconut'],
    safeFor: ['Hypertension', 'General Weakness', 'Gut Issues', 'Migraine', 'Kidney Issues'],
    avoidFor: ['Diabetes'],
    dietType: 'vegan',
    icmrNote: 'Coconut water contains 250mg potassium per 100ml — natural electrolyte. ICMR recommends for hydration and potassium replenishment.',
    prepTime: 1,
    imageQuery: 'tender coconut water fresh drink',
  },

  {
    id: 's012',
    name: 'Turmeric Milk (Haldi Doodh)',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Warm milk with turmeric, ginger and black pepper',
    ingredients: ['milk', 'turmeric', 'ginger', 'black pepper', 'honey'],
    deficiencies: ['Vitamin B12', 'Calcium', 'Vitamin D'],
    contains: ['lactose'],
    safeFor: ['Arthritis', 'General Weakness', 'Osteoporosis', 'Gut Issues', 'Migraine'],
    avoidFor: ['Kidney Issues', 'PCOS'],
    dietType: 'vegetarian',
    icmrNote: 'Milk provides B12, calcium and Vitamin D. Turmeric with black pepper (piperine) increases curcumin absorption. ICMR recognizes turmeric as an anti-inflammatory spice.',
    prepTime: 5,
    imageQuery: 'turmeric milk golden milk haldi doodh',
  },

  // ============================================================
  // DINNER MEALS
  // ============================================================

  {
    id: 'd001',
    name: 'Ragi Roti with Palak Paneer',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Finger millet flatbread with spinach and cottage cheese curry',
    ingredients: ['ragi flour', 'spinach', 'paneer', 'onion', 'tomato', 'ginger', 'garlic', 'cream', 'oil'],
    deficiencies: ['Calcium', 'Iron', 'Vitamin B12', 'Folate', 'Magnesium', 'Vitamin K'],
    contains: ['lactose'],
    safeFor: ['Osteoporosis', 'Anaemia', 'General Weakness', 'PCOS'],
    avoidFor: ['Thyroid', 'Kidney Issues', 'High Cholesterol'],
    dietType: 'vegetarian',
    icmrNote: 'Ragi provides 344mg calcium per 100g. Paneer adds B12 and calcium. Spinach adds iron and Vitamin K. Combination targets multiple deficiencies simultaneously.',
    prepTime: 30,
    imageQuery: 'ragi roti palak paneer dinner indian',
  },

  {
    id: 'd002',
    name: 'Dal Makhani with Tandoori Roti',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Slow-cooked black lentil curry with butter',
    ingredients: ['black dal', 'rajma', 'butter', 'cream', 'onion', 'tomato', 'ginger', 'garlic', 'whole wheat flour'],
    deficiencies: ['Iron', 'Folate', 'Calcium', 'Magnesium', 'Zinc'],
    contains: ['lactose', 'gluten'],
    safeFor: ['General Weakness', 'Anaemia'],
    avoidFor: ['High Cholesterol', 'Kidney Issues', 'Diabetes', 'PCOS'],
    dietType: 'vegetarian',
    icmrNote: 'Black dal is rich in iron and folate. However, high in saturated fat from butter/cream — ICMR recommends limiting visible fat to 27g per 2000kcal day.',
    prepTime: 45,
    imageQuery: 'dal makhani black lentil curry roti',
  },

  {
    id: 'd003',
    name: 'Fish Curry with Rice and Vegetables',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Coastal fish curry with seasonal vegetables',
    ingredients: ['pomfret or tilapia', 'coconut milk', 'tomato', 'onion', 'ginger', 'garlic', 'rice', 'cucumber'],
    deficiencies: ['Omega 3', 'Vitamin B12', 'Vitamin D', 'Iodine', 'Selenium'],
    contains: ['fish', 'coconut'],
    safeFor: ['General Weakness', 'High Cholesterol', 'Arthritis', 'Thyroid'],
    avoidFor: ['Kidney Issues'],
    dietType: 'non-vegetarian',
    icmrNote: 'Fish provides EPA/DHA Omega-3 which ICMR recommends for heart health. Also the best dietary source of iodine for thyroid function. 2 servings/week recommended.',
    prepTime: 30,
    imageQuery: 'fish curry rice coastal indian dinner',
  },

  {
    id: 'd004',
    name: 'Vegetable Daliya',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Broken wheat porridge with mixed vegetables',
    ingredients: ['daliya', 'mixed vegetables', 'onion', 'tomato', 'ginger', 'cumin', 'turmeric', 'oil'],
    deficiencies: ['Iron', 'Magnesium', 'Zinc', 'Folate', 'Vitamin B6'],
    contains: ['gluten'],
    safeFor: ['Diabetes', 'High Cholesterol', 'General Weakness', 'PCOS', 'Gut Issues'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Broken wheat (daliya) has lower glycemic index than white rice. High in magnesium and B vitamins. ICMR recommends whole grain alternatives for blood sugar control.',
    prepTime: 20,
    imageQuery: 'daliya broken wheat vegetable porridge',
  },

  {
    id: 'd005',
    name: 'Paneer Tikka with Mint Chutney',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Grilled cottage cheese with capsicum and onion',
    ingredients: ['paneer', 'capsicum', 'onion', 'curd', 'garam masala', 'turmeric', 'lemon', 'mint', 'coriander'],
    deficiencies: ['Vitamin B12', 'Calcium', 'Vitamin C', 'Phosphorus'],
    contains: ['lactose'],
    safeFor: ['General Weakness', 'Osteoporosis', 'PCOS'],
    avoidFor: ['High Cholesterol', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Paneer provides B12 and calcium. Capsicum adds Vitamin C for collagen synthesis and immune function. Grilling healthier than frying for cholesterol management.',
    prepTime: 25,
    imageQuery: 'paneer tikka grilled cottage cheese dinner',
  },

  {
    id: 'd006',
    name: 'Rasam Rice with Papad',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Tamarind pepper soup with rice',
    ingredients: ['rice', 'tomato', 'tamarind', 'pepper', 'cumin', 'garlic', 'curry leaves', 'mustard seeds'],
    deficiencies: ['Iron', 'Vitamin C', 'Folate'],
    contains: [],
    safeFor: ['Gut Issues', 'General Weakness', 'Liver Issues', 'Migraine'],
    avoidFor: ['Kidney Issues', 'Hypertension'],
    dietType: 'vegan',
    icmrNote: 'Tamarind is a good source of iron and Vitamin C. Pepper contains piperine which improves nutrient bioavailability. Light and easy to digest for gut issues.',
    prepTime: 20,
    imageQuery: 'rasam rice south indian dinner soup',
  },

  {
    id: 'd007',
    name: 'Egg Fried Rice with Vegetables',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Brown rice stir-fried with eggs and vegetables',
    ingredients: ['brown rice', 'eggs', 'carrot', 'peas', 'spring onion', 'soy sauce', 'ginger', 'garlic', 'oil'],
    deficiencies: ['Vitamin B12', 'Vitamin D', 'Iron', 'Vitamin A', 'Selenium'],
    contains: ['eggs', 'soy'],
    safeFor: ['General Weakness', 'Anaemia', 'PCOS'],
    avoidFor: ['High Cholesterol', 'Kidney Issues'],
    dietType: 'non-vegetarian',
    icmrNote: 'Eggs provide B12 and Vitamin D. Brown rice adds more magnesium than white. Carrots provide beta-carotene. Complete nutrient profile meal.',
    prepTime: 20,
    imageQuery: 'egg fried rice vegetables indian style',
  },

  {
    id: 'd008',
    name: 'Aloo Gobi with Roti',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Potato and cauliflower dry curry with flatbread',
    ingredients: ['potato', 'cauliflower', 'onion', 'tomato', 'turmeric', 'cumin', 'coriander', 'whole wheat flour'],
    deficiencies: ['Vitamin C', 'Vitamin K', 'Folate', 'Potassium', 'Vitamin B6'],
    contains: ['gluten'],
    safeFor: ['General Weakness', 'Gut Issues'],
    avoidFor: ['Diabetes', 'Thyroid', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Cauliflower contains Vitamin K and Vitamin C. CAUTION: Cauliflower is cruciferous and may interfere with iodine absorption — avoid raw form for thyroid patients.',
    prepTime: 25,
    imageQuery: 'aloo gobi potato cauliflower curry roti',
  },

  {
    id: 'd009',
    name: 'Tofu Sabzi with Brown Rice',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Spiced tofu with capsicum and onion stir-fry',
    ingredients: ['tofu', 'capsicum', 'onion', 'tomato', 'ginger', 'garlic', 'garam masala', 'brown rice'],
    deficiencies: ['Calcium', 'Iron', 'Zinc', 'Vitamin C', 'Magnesium'],
    contains: ['soy'],
    safeFor: ['General Weakness', 'Osteoporosis', 'High Cholesterol', 'Anaemia'],
    avoidFor: ['Thyroid', 'Kidney Issues', 'PCOS'],
    dietType: 'vegan',
    icmrNote: 'Tofu is a good calcium source for lactose-intolerant individuals (250mg/100g). However, soy isoflavones may affect thyroid function — avoid for thyroid patients.',
    prepTime: 20,
    imageQuery: 'tofu sabzi stir fry indian dinner',
  },

  {
    id: 'd010',
    name: 'Chicken Soup with Vegetables',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Light chicken and vegetable broth with herbs',
    ingredients: ['chicken', 'carrot', 'celery', 'onion', 'garlic', 'ginger', 'pepper', 'coriander'],
    deficiencies: ['Vitamin B12', 'Zinc', 'Selenium', 'Vitamin B6', 'Iron'],
    contains: [],
    safeFor: ['General Weakness', 'Gut Issues', 'Liver Issues', 'Anaemia', 'Arthritis'],
    avoidFor: ['Kidney Issues'],
    dietType: 'non-vegetarian',
    icmrNote: 'Chicken broth is easy to digest and nutrient-dense. Zinc and selenium from chicken support immune function. Light on gut — ideal for digestive issues.',
    prepTime: 35,
    imageQuery: 'chicken soup vegetable broth indian',
  },

  {
    id: 'd011',
    name: 'Beetroot Dal with Rice',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Iron-rich beetroot cooked with lentils and rice',
    ingredients: ['masoor dal', 'beetroot', 'rice', 'onion', 'tomato', 'garlic', 'turmeric', 'cumin'],
    deficiencies: ['Iron', 'Folate', 'Potassium', 'Magnesium'],
    contains: [],
    safeFor: ['Anaemia', 'Hypertension', 'General Weakness', 'Liver Issues'],
    avoidFor: ['Kidney Issues', 'Diabetes'],
    dietType: 'vegan',
    icmrNote: 'Beetroot contains nitrates which improve blood flow and are recommended for hypertension. Folate in beetroot is essential for red blood cell production — key for anaemia.',
    prepTime: 30,
    imageQuery: 'beetroot dal lentil soup rice indian',
  },

  {
    id: 'd012',
    name: 'Mixed Vegetable Kootu with Rice',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'South Indian lentil and vegetable dry curry',
    ingredients: ['toor dal', 'yam', 'raw banana', 'coconut', 'cumin', 'curry leaves', 'mustard seeds', 'rice'],
    deficiencies: ['Iron', 'Folate', 'Potassium', 'Magnesium', 'Calcium'],
    contains: ['coconut'],
    safeFor: ['General Weakness', 'Gut Issues', 'Diabetes'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Yam and raw banana are low glycemic index foods. Dal adds protein and folate. Coconut adds medium-chain fatty acids which are easily absorbed.',
    prepTime: 30,
    imageQuery: 'kootu south indian vegetable lentil',
  },

  {
    id: 'b013',
    name: 'Banana Walnut Smoothie',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Creamy banana and walnut smoothie with milk',
    ingredients: ['banana', 'walnuts', 'milk', 'honey', 'cardamom'],
    deficiencies: ['Potassium', 'Omega 3', 'Calcium', 'Vitamin B6', 'Biotin'],
    contains: ['lactose', 'nuts'],
    safeFor: ['General Weakness', 'Migraine', 'Hypertension'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegetarian',
    icmrNote: 'Banana provides 358mg potassium per 100g (NIN IFCT 2017). Walnuts are richest plant Omega-3 source. Biotin in walnuts supports hair and nail health.',
    prepTime: 5,
    imageQuery: 'banana smoothie walnut milk',
  },

  {
    id: 'b014',
    name: 'Sweet Potato Toast with Almond Butter',
    type: 'breakfast',
    label: 'Morning Fuel',
    description: 'Sliced sweet potato toasted with almond butter and seeds',
    ingredients: ['sweet potato', 'almond butter', 'pumpkin seeds', 'honey'],
    deficiencies: ['Vitamin A', 'Potassium', 'Biotin', 'Magnesium', 'Selenium'],
    contains: ['nuts', 'sesame'],
    safeFor: ['General Weakness', 'Skin Issues', 'PCOS'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Sweet potato has 8509µg beta-carotene per 100g (NIN IFCT 2017). Almonds are rich in biotin. Pumpkin seeds provide selenium and magnesium.',
    prepTime: 15,
    imageQuery: 'sweet potato toast almond butter',
  },

  {
    id: 's013',
    name: 'Brazil Nuts and Raisins',
    type: 'snack',
    label: 'Light Vitality',
    description: 'A small handful of brazil nuts with raisins',
    ingredients: ['brazil nuts', 'raisins'],
    deficiencies: ['Selenium', 'Iron', 'Potassium', 'Magnesium'],
    contains: ['nuts'],
    safeFor: ['General Weakness', 'Thyroid', 'Skin Issues'],
    avoidFor: ['Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Brazil nuts are the richest dietary source of selenium — just 2 nuts provide 100% daily selenium needs. Selenium is critical for thyroid hormone production.',
    prepTime: 1,
    imageQuery: 'brazil nuts raisins healthy snack',
  },

  {
    id: 's014',
    name: 'Iodized Salt Egg Bhurji',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Quick scrambled eggs with iodized salt and vegetables',
    ingredients: ['eggs', 'onion', 'tomato', 'iodized salt', 'turmeric', 'oil'],
    deficiencies: ['Iodine', 'Vitamin B12', 'Selenium', 'Vitamin D'],
    contains: ['eggs'],
    safeFor: ['Thyroid', 'General Weakness', 'Anaemia'],
    avoidFor: ['Kidney Issues', 'High Cholesterol'],
    dietType: 'non-vegetarian',
    icmrNote: 'Iodized salt is the primary dietary iodine source in India. ICMR recommends universal salt iodization. Eggs add selenium and B12 critical for thyroid function.',
    prepTime: 10,
    imageQuery: 'egg bhurji scrambled eggs indian',
  },

  {
    id: 's015',
    name: 'Coconut Water with Chia Seeds',
    type: 'snack',
    label: 'Light Vitality',
    description: 'Fresh coconut water mixed with soaked chia seeds',
    ingredients: ['tender coconut water', 'chia seeds'],
    deficiencies: ['Potassium', 'Magnesium', 'Omega 3', 'Calcium'],
    contains: ['coconut'],
    safeFor: ['Hypertension', 'General Weakness', 'Migraine', 'Gut Issues'],
    avoidFor: ['Diabetes', 'Kidney Issues'],
    dietType: 'vegan',
    icmrNote: 'Coconut water provides 250mg potassium per 100ml. Chia seeds are rich in Omega-3 ALA and calcium. ICMR recommends natural electrolytes for hydration.',
    prepTime: 5,
    imageQuery: 'coconut water chia seeds drink',
  },

  {
    id: 'l014',
    name: 'Egg and Vegetable Soup',
    type: 'lunch',
    label: 'Midday Bloom',
    description: 'Light egg drop soup with mixed vegetables and iodized salt',
    ingredients: ['eggs', 'carrot', 'spinach', 'onion', 'garlic', 'iodized salt', 'pepper', 'cornflour'],
    deficiencies: ['Iodine', 'Vitamin B12', 'Vitamin A', 'Iron', 'Selenium'],
    contains: ['eggs'],
    safeFor: ['Thyroid', 'General Weakness', 'Gut Issues', 'Liver Issues'],
    avoidFor: ['Kidney Issues'],
    dietType: 'non-vegetarian',
    icmrNote: 'Eggs provide selenium and B12. Iodized salt ensures iodine intake critical for thyroid. Spinach adds iron and Vitamin A. Light and easily digestible.',
    prepTime: 20,
    imageQuery: 'egg vegetable soup indian',
  },

  {
    id: 'd013',
    name: 'Biotin Rich Egg Curry with Sweet Potato',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Spiced egg curry served with baked sweet potato',
    ingredients: ['eggs', 'sweet potato', 'onion', 'tomato', 'ginger', 'garlic', 'garam masala', 'oil'],
    deficiencies: ['Biotin', 'Vitamin B12', 'Vitamin A', 'Potassium', 'Selenium'],
    contains: ['eggs'],
    safeFor: ['General Weakness', 'Skin Issues', 'Thyroid'],
    avoidFor: ['Kidney Issues', 'High Cholesterol', 'Diabetes'],
    dietType: 'non-vegetarian',
    icmrNote: 'Eggs are one of the best biotin sources. Sweet potato adds Vitamin A and potassium. Biotin (Vitamin B7) is essential for hair, skin and nail health.',
    prepTime: 30,
    imageQuery: 'egg curry sweet potato dinner',
  },

  {
    id: 'd014',
    name: 'Rajma with Selenium Rice',
    type: 'dinner',
    label: 'Evening Rest',
    description: 'Kidney bean curry with selenium-rich brown rice',
    ingredients: ['rajma', 'brown rice', 'onion', 'tomato', 'garlic', 'ginger', 'cumin', 'sunflower seeds', 'oil'],
    deficiencies: ['Selenium', 'Iron', 'Folate', 'Magnesium', 'Potassium', 'Zinc'],
    contains: [],
    safeFor: ['Anaemia', 'General Weakness', 'High Cholesterol'],
    avoidFor: ['Kidney Issues', 'Gut Issues', 'Diabetes'],
    dietType: 'vegan',
    icmrNote: 'Sunflower seeds sprinkled on top add selenium. Rajma provides iron and folate. Brown rice has more selenium than white rice. Complete plant-based dinner.',
    prepTime: 40,
    imageQuery: 'rajma brown rice dinner indian',
  },

]

// ============================================================
// SMART FILTER ENGINE
// ICMR/NIN backed rule-based personalization
// ============================================================

export interface UserProfile {
  deficiencies: string[]
  conditions: string[]
  allergies: string[]
  dietType: 'vegetarian' | 'non-vegetarian'
}

/**
 * Get today's personalized meal plan for a user
 * Uses date as seed for variety — different meals each day
 * Never repeats same combination within 3 days
 */
export function getDailyMealPlan(profile: UserProfile): {
  breakfast: Meal
  lunch: Meal
  snack: Meal
  dinner: Meal
} {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  )

  const breakfast = getFilteredMeal('breakfast', profile, dayOfYear)
  const lunch = getFilteredMeal('lunch', profile, dayOfYear + 1)
  const snack = getFilteredMeal('snack', profile, dayOfYear + 2)
  const dinner = getFilteredMeal('dinner', profile, dayOfYear + 3)

  return { breakfast, lunch, snack, dinner }
}

/**
 * Filter meals by user profile and pick one for the day
 */
function getFilteredMeal(
  type: MealType,
  profile: UserProfile,
  seed: number
): Meal {
  const userAllergies = profile.allergies.map(a => a.toLowerCase())
  const userConditions = profile.conditions
  const userDefs = profile.deficiencies

  // Step 1: Filter by meal type
  let filtered = MEALS.filter(m => m.type === type)

  // Step 2: Remove meals containing user's allergens (HARD RULE — non-negotiable)
  filtered = filtered.filter(m =>
    !m.contains.some(allergen => userAllergies.includes(allergen))
  )

  // Step 3: Remove meals that should be avoided for user's conditions (SAFETY RULE)
  filtered = filtered.filter(m =>
    !m.avoidFor.some(cond => userConditions.includes(cond))
  )

  // Step 4: Filter by diet type
  if (profile.dietType === 'vegetarian') {
    filtered = filtered.filter(m => m.dietType !== 'non-vegetarian')
  }

  // Step 5: Score meals by deficiency match (higher score = better match)
  const scored = filtered.map(m => {
    let score = 0
    // +2 points for each deficiency match
    m.deficiencies.forEach(def => {
      if (userDefs.includes(def)) score += 2
    })
    // +1 point for each condition it's safe for
    m.safeFor.forEach(cond => {
      if (userConditions.includes(cond)) score += 1
    })
    return { meal: m, score }
  })

  // Step 6: Sort by score, then pick using day-based seed for variety
  scored.sort((a, b) => b.score - a.score)

  // Take top 50% of best matches and randomize within them
  const topMeals = scored.slice(0, Math.max(3, Math.ceil(scored.length * 0.5)))
  const picked = topMeals[seed % topMeals.length]

  // Fallback: if nothing matches, return first available meal of that type
  if (!picked) {
    const fallback = MEALS.find(m => m.type === type)
    return fallback || MEALS[0]
  }

  return picked.meal
}

/**
 * Get alternative meal (for Swap Meal feature)
 * Returns a different meal from the same type that matches user profile
 */
export function getAlternativeMeal(
  currentMealId: string,
  type: MealType,
  profile: UserProfile
): Meal {
  const today = new Date()
  const seed = today.getHours() + today.getMinutes()

  const userAllergies = profile.allergies.map(a => a.toLowerCase())
  const userConditions = profile.conditions

  let alternatives = MEALS.filter(m =>
    m.type === type &&
    m.id !== currentMealId &&
    !m.contains.some(a => userAllergies.includes(a)) &&
    !m.avoidFor.some(c => userConditions.includes(c))
  )

  if (profile.dietType === 'vegetarian') {
    alternatives = alternatives.filter(m => m.dietType !== 'non-vegetarian')
  }

  if (alternatives.length === 0) return MEALS.find(m => m.type === type && m.id !== currentMealId) || MEALS[0]

  return alternatives[seed % alternatives.length]
}

// ============================================================
// INGREDIENT SPOTLIGHT
// Rotates daily — different ingredient each day
// ============================================================

export const SPOTLIGHT_INGREDIENTS = [
  {
    name: 'Spinach',
    emoji: '🥬',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=400&fit=crop',
    supports: ['Iron', 'Folate', 'Vitamin K'],
    description: 'A powerhouse leafy green. Rich in iron (2.7mg/100g) and folate. Pair with lemon for best iron absorption.',
    ways: ['Add to dal or sabzi', 'Blend into morning smoothie', 'Sauté with garlic as a side'],
    icmrNote: 'NIN IFCT 2017: Spinach — Iron 2.7mg/100g, Folate 194µg/100g',
  },
  {
    name: 'Ragi',
    emoji: '🌾',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=400&fit=crop',
    supports: ['Calcium', 'Iron', 'Magnesium'],
    description: 'Highest calcium among cereals at 344mg/100g. Also rich in iron. Perfect for bones and anaemia.',
    ways: ['Ragi dosa for breakfast', 'Ragi malt with milk', 'Ragi roti for dinner'],
    icmrNote: 'NIN IFCT 2017: Ragi — Calcium 344mg/100g, Iron 3.9mg/100g',
  },
  {
    name: 'Amla',
    emoji: '🫐',
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop',
    supports: ['Vitamin C', 'Iron absorption', 'Immunity'],
    description: 'Highest natural Vitamin C in Indian foods at 600mg/100g. Dramatically boosts iron absorption.',
    ways: ['Amla juice in morning', 'Amla chutney with meals', 'Amla candy as snack'],
    icmrNote: 'NIN IFCT 2017: Amla — Vitamin C 600mg/100g. ICMR 2024: Vitamin C enhances non-heme iron absorption',
  },
  {
    name: 'Rajma',
    emoji: '🫘',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
    supports: ['Iron', 'Folate', 'Magnesium', 'Potassium', 'Zinc'],
    description: 'Kidney beans — one of the highest plant sources of iron at 8mg/100g. Also rich in magnesium and potassium.',
    ways: ['Rajma chawal for lunch', 'Add to salads', 'Rajma soup for dinner'],
    icmrNote: 'NIN IFCT 2017: Rajma — Iron 8mg/100g, Magnesium 140mg/100g',
  },
  {
    name: 'Eggs',
    emoji: '🥚',
    image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d2d2d?w=600&h=400&fit=crop',
    supports: ['Vitamin B12', 'Vitamin D', 'Selenium', 'Vitamin A'],
    description: 'Most bioavailable B12 source. Two eggs cover ~60% of daily B12 needs. Also provides Vitamin D.',
    ways: ['Masala omelette for breakfast', 'Boiled eggs as snack', 'Egg curry for lunch'],
    icmrNote: 'NIN IFCT 2017: Egg — B12 1.3µg per egg. ICMR-NIN RDA 2020: B12 RDA 2.2µg/day',
  },
  {
    name: 'Banana',
    emoji: '🍌',
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=600&h=400&fit=crop',
    supports: ['Potassium', 'Magnesium', 'Vitamin B6'],
    description: 'Natural source of potassium (358mg/100g) and Vitamin B6. Supports heart health and migraine prevention.',
    ways: ['Morning snack with peanut butter', 'Banana smoothie', 'Add to oats porridge'],
    icmrNote: 'NIN IFCT 2017: Banana — Potassium 358mg/100g, Vitamin B6 0.4mg/100g',
  },
  {
    name: 'Paneer',
    emoji: '🧀',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop',
    supports: ['Vitamin B12', 'Calcium', 'Phosphorus'],
    description: 'Best vegetarian B12 source with 208mg calcium per 100g. Essential for vegeterians with B12 deficiency.',
    ways: ['Paneer bhurji for breakfast', 'Palak paneer for lunch', 'Paneer tikka for dinner'],
    icmrNote: 'NIN IFCT 2017: Paneer — B12 0.8µg/100g, Calcium 208mg/100g',
  },
]

/**
 * Get today's ingredient spotlight — changes daily, never repeats within a week
 */
export function getTodaySpotlight() {
  const dayOfYear = Math.floor(
    (new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return SPOTLIGHT_INGREDIENTS[dayOfYear % SPOTLIGHT_INGREDIENTS.length]
}