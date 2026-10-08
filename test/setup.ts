import { afterEach, beforeEach, vi } from 'vitest'
import { requestMock } from './mocks/uni'

beforeEach(() => {
  vi.resetModules()
  requestMock.mockReset()
  vi.stubGlobal('uni', { request: requestMock })
  vi.stubEnv('VITE_API_BASE_URL', '')
  vi.stubEnv('VITE_USE_MOCK', 'false')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.restoreAllMocks()
})
