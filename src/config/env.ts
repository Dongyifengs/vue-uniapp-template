export const env = {
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').trim(),
  useMock: import.meta.env.DEV && import.meta.env.VITE_USE_MOCK === 'true',
}
