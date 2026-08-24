import 'server-only'
import { GoogleGenAI } from '@google/genai'
import { buildPrompt, type PersonInput } from './buildPrompt.ts'

const DEFAULT_MODEL = 'gemini-2.0-flash'
const MAX_OUTPUT_TOKENS = 1024

/**
 * Calls the Gemini API and returns a plain-text explanation.
 * This module is server-only — it reads GEMINI_API_KEY from the server environment.
 * It never logs or returns the key; errors are thrown as generic Error objects
 * so the caller (server action) can map them to safe user-facing codes.
 */
export async function explainPerson(person: PersonInput, locale: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('Gemini API key is not configured')
  }

  const model = process.env.GEMINI_MODEL ?? DEFAULT_MODEL
  const prompt = buildPrompt(person, locale)

  const ai = new GoogleGenAI({ apiKey })
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { maxOutputTokens: MAX_OUTPUT_TOKENS },
  })

  const text = response.text
  if (!text) {
    throw new Error('Empty response from Gemini')
  }

  return text
}
