// Manual Jest mock for @google/genai.
// The real package is ESM-only and cannot be loaded by Jest's CommonJS runner.
// Tests configure this mock via MockedClass.mockImplementation in beforeEach.
export const GoogleGenAI = jest.fn()
