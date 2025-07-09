import { getProviderIds } from './providers'
import { getProviderEnvVars } from './utils'

export interface ProviderConfig {
  provider: string
  clientId: string
  clientSecret: string
  isConfigured: boolean
  missingVars: string[]
}

export interface OAuthLibraryConfig {
  providers: ProviderConfig[]
  configuredProviders: string[]
  missingConfigurations: string[]
}

/**
 * Validate OAuth configuration for all providers
 */
export function validateOAuthConfig(): OAuthLibraryConfig {
  const providerIds = getProviderIds()
  const providers: ProviderConfig[] = []
  const configuredProviders: string[] = []
  const missingConfigurations: string[] = []

  for (const providerId of providerIds) {
    const envVars = getProviderEnvVars(providerId)
    const clientId = process.env[envVars.clientId]
    const clientSecret = process.env[envVars.clientSecret]
    
    const missingVars: string[] = []
    
    if (!clientId) {
      missingVars.push(envVars.clientId)
    }
    
    if (!clientSecret) {
      missingVars.push(envVars.clientSecret)
    }

    const isConfigured = missingVars.length === 0
    
    const config: ProviderConfig = {
      provider: providerId,
      clientId: clientId || '',
      clientSecret: clientSecret || '',
      isConfigured,
      missingVars
    }

    providers.push(config)

    if (isConfigured) {
      configuredProviders.push(providerId)
    } else {
      missingConfigurations.push(providerId)
    }
  }

  return {
    providers,
    configuredProviders,
    missingConfigurations
  }
}

/**
 * Get configuration for a specific provider
 */
export function getProviderConfig(providerId: string): ProviderConfig | null {
  const config = validateOAuthConfig()
  return config.providers.find(p => p.provider === providerId) || null
}

/**
 * Check if a provider is configured
 */
export function isProviderConfigured(providerId: string): boolean {
  const config = getProviderConfig(providerId)
  return config?.isConfigured || false
}

/**
 * Get list of configured providers
 */
export function getConfiguredProviders(): string[] {
  return validateOAuthConfig().configuredProviders
}

/**
 * Generate environment variable template
 */
export function generateEnvTemplate(): string {
  const providerIds = getProviderIds()
  const lines: string[] = []
  
  lines.push('# OAuth Provider Configuration')
  lines.push('# Copy this to your .env.local file and fill in your credentials')
  lines.push('')

  for (const providerId of providerIds) {
    const envVars = getProviderEnvVars(providerId)
    const upperName = providerId.toUpperCase()
    
    lines.push(`# ${upperName} OAuth Configuration`)
    lines.push(`${envVars.clientId}=your_${providerId}_client_id`)
    lines.push(`${envVars.clientSecret}=your_${providerId}_client_secret`)
    
    if (envVars.publicClientId) {
      lines.push(`${envVars.publicClientId}=your_${providerId}_client_id`)
    }
    
    lines.push('')
  }

  return lines.join('\n')
}

/**
 * Validate and provide setup instructions
 */
export function getSetupInstructions(): {
  isComplete: boolean
  instructions: string[]
  configuredCount: number
  totalCount: number
} {
  const config = validateOAuthConfig()
  const instructions: string[] = []
  
  if (config.missingConfigurations.length > 0) {
    instructions.push('To complete the OAuth setup, you need to:')
    instructions.push('')
    
    for (const providerId of config.missingConfigurations) {
      const providerConfig = config.providers.find(p => p.provider === providerId)
      if (providerConfig) {
        instructions.push(`${providerId.toUpperCase()}:`)
        providerConfig.missingVars.forEach(varName => {
          instructions.push(`  - Set ${varName} in your environment variables`)
        })
        instructions.push('')
      }
    }
    
    instructions.push('Environment variable template:')
    instructions.push(generateEnvTemplate())
  }

  return {
    isComplete: config.missingConfigurations.length === 0,
    instructions,
    configuredCount: config.configuredProviders.length,
    totalCount: config.providers.length
  }
}

/**
 * Create a configuration report
 */
export function createConfigReport(): string {
  const config = validateOAuthConfig()
  const report: string[] = []
  
  report.push('OAuth Provider Configuration Report')
  report.push('=' .repeat(40))
  report.push('')
  
  report.push(`Total Providers: ${config.providers.length}`)
  report.push(`Configured: ${config.configuredProviders.length}`)
  report.push(`Missing Configuration: ${config.missingConfigurations.length}`)
  report.push('')
  
  if (config.configuredProviders.length > 0) {
    report.push('✅ Configured Providers:')
    config.configuredProviders.forEach(providerId => {
      report.push(`  - ${providerId}`)
    })
    report.push('')
  }
  
  if (config.missingConfigurations.length > 0) {
    report.push('❌ Missing Configuration:')
    config.missingConfigurations.forEach(providerId => {
      const providerConfig = config.providers.find(p => p.provider === providerId)
      if (providerConfig) {
        report.push(`  - ${providerId}: ${providerConfig.missingVars.join(', ')}`)
      }
    })
    report.push('')
  }
  
  return report.join('\n')
}