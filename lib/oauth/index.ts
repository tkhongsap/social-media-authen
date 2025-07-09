// Main OAuth library exports
export * from './types'
export * from './errors'
export * from './handler'
export * from './normalizer'
export * from './session'
export * from './utils'
export * from './providers'

// Re-export commonly used functions for convenience
export { OAuthHandler } from './handler'
export { SessionManager } from './session'
export { UserProfileNormalizer } from './normalizer'
export { 
  getProvider, 
  getAllProviders, 
  getProviderIds, 
  isValidProvider 
} from './providers'
export { 
  loadProviderConfig, 
  validateProviderConfig, 
  createErrorRedirectUrl, 
  createSuccessRedirectUrl 
} from './utils'