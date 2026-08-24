'use server'
import { explainPerson } from '../../services/gemini.ts'
import type { PersonInput } from '../../services/buildPrompt.ts'

export type ErrorCode = 'not_configured' | 'quota_exceeded' | 'empty_response' | 'unknown'

export type ExplainResult =
  { explanation: string; errorCode?: never } | { errorCode: ErrorCode; explanation?: never }

function mapErrorToCode(err: unknown): ErrorCode {
  const message = err instanceof Error ? err.message : ''
  if (message.includes('not configured')) return 'not_configured'
  if (
    message.includes('429') ||
    message.toLowerCase().includes('quota') ||
    message.includes('RESOURCE_EXHAUSTED')
  )
    return 'quota_exceeded'
  if (message.includes('Empty response')) return 'empty_response'
  return 'unknown'
}

/**
 * Server Action: requests an AI explanation for a Star Wars character.
 * - Validates input before calling the model.
 * - Returns only the explanation text or a safe error code — never SDK internals,
 *   stack traces, prompts, or secret values.
 */
export async function explainPersonAction(
  person: PersonInput,
  locale: string,
): Promise<ExplainResult> {
  if (!person?.name?.trim()) {
    return { errorCode: 'unknown' }
  }

  try {
    const explanation = await explainPerson(person, locale)
    return { explanation }
  } catch (err) {
    return { errorCode: mapErrorToCode(err) }
  }
}
