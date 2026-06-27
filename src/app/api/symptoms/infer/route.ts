import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { symptoms } = await request.json()

    const prompt = `You are a nutrition expert. Based on these symptoms: ${symptoms.join(', ')}, identify the most likely vitamin and mineral deficiencies from this list only: Vitamin B12, Vitamin D, Iron, Calcium, Folate, Magnesium, Zinc, Vitamin C, Omega 3, Vitamin A, Vitamin E, Vitamin K, Iodine, Potassium, Selenium.

Return ONLY a JSON object like this, no other text:
{"deficiencies": ["Vitamin B12", "Iron"], "explanation": "one sentence explanation"}`

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 200 }
        }),
      }
    )

    const data = await response.json()
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    return NextResponse.json(parsed)
  } catch (error) {
    return NextResponse.json(
      { error: 'AI analysis failed. Please try again.' },
      { status: 500 }
    )
  }
}