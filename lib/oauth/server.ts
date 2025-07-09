// Server-only OAuth library exports
export * from './types'
export * from './errors'
export * from './handler'
export * from './normalizer'
export * from './session'
export * from './utils'
export * from './providers'
export * from './config'

// Re-export commonly used server functions
export { OAuthHandler } from './handler'
export { SessionManager } from './session'
export { UserProfileNormalizer } from './normalizer'
export { 
  getProvider, 
  getAllProviders, 
  getProviderIds, 
  isValidProvider,
  normalizeProfile 
} from './providers'
export { 
  loadProviderConfig, 
  validateProviderConfig, 
  createErrorRedirectUrl, 
  createSuccessRedirectUrl 
} from './utils'
export {
  validateOAuthConfig,
  getProviderConfig,
  isProviderConfigured,
  getConfiguredProviders
} from './config'