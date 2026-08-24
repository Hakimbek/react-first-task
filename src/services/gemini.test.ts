// @google/genai is redirected to __mocks__/@google/genai.ts via jest moduleNameMapper.
// No jest.mock() call is needed — the manual mock is always active.
import { GoogleGenAI } from '@google/genai'
import { explainPerson } from './gemini'

const MockedGoogleGenAI = GoogleGenAI as jest.MockedClass<typeof GoogleGenAI>

const basePerson = {
  name: 'Luke Skywalker',
  height: '172',
  mass: '77',
  hair_color: 'blond',
  skin_color: 'fair',
  eye_color: 'blue',
  birth_year: '19BBY',
  gender: 'male',
}

describe('explainPerson', () => {
  let mockGenerateContent: jest.Mock

  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-api-key'
    mockGenerateContent = jest.fn()
    MockedGoogleGenAI.mockImplementation(
      () =>
        ({
          models: { generateContent: mockGenerateContent },
        }) as unknown as InstanceType<typeof GoogleGenAI>,
    )
  })

  afterEach(() => {
    delete process.env.GEMINI_API_KEY
    delete process.env.GEMINI_MODEL
    jest.clearAllMocks()
  })

  it('returns the explanation text on a successful call', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Luke is a heroic Jedi.' })
    const result = await explainPerson(basePerson, 'en')
    expect(result).toBe('Luke is a heroic Jedi.')
  })

  it('calls the SDK with the configured model', async () => {
    process.env.GEMINI_MODEL = 'gemini-test-model'
    mockGenerateContent.mockResolvedValue({ text: 'Some explanation.' })
    await explainPerson(basePerson, 'en')
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-test-model' }),
    )
  })

  it('falls back to the default model when GEMINI_MODEL is not set', async () => {
    mockGenerateContent.mockResolvedValue({ text: 'Some explanation.' })
    await explainPerson(basePerson, 'en')
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({ model: 'gemini-2.0-flash' }),
    )
  })

  it('throws when GEMINI_API_KEY is missing', async () => {
    delete process.env.GEMINI_API_KEY
    await expect(explainPerson(basePerson, 'en')).rejects.toThrow('not configured')
  })

  it('throws when the model returns an empty string', async () => {
    mockGenerateContent.mockResolvedValue({ text: '' })
    await expect(explainPerson(basePerson, 'en')).rejects.toThrow('Empty response')
  })

  it('throws when the model returns undefined text', async () => {
    mockGenerateContent.mockResolvedValue({ text: undefined })
    await expect(explainPerson(basePerson, 'en')).rejects.toThrow('Empty response')
  })

  it('propagates SDK network errors', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Network failure'))
    await expect(explainPerson(basePerson, 'en')).rejects.toThrow('Network failure')
  })

  it('does not expose the API key in thrown errors', async () => {
    mockGenerateContent.mockRejectedValue(new Error('Some SDK error with details'))
    try {
      await explainPerson(basePerson, 'en')
    } catch (err) {
      expect((err as Error).message).not.toContain('test-api-key')
    }
  })
})
