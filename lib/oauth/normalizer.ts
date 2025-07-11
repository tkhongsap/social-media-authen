import { UserProfile } from './types'
import { normalizeProfile, type ProviderId } from './providers'

export class UserProfileNormalizer {
  /**
   * Normalize user profile from any provider to standard format
   */
  static normalize(providerId: ProviderId, rawProfile: any): UserProfile {
    const normalizedProfile = normalizeProfile(providerId, rawProfile)
    
    return {
      id: normalizedProfile.id,
      email: normalizedProfile.email,
      name: normalizedProfile.name,
      displayName: normalizedProfile.displayName,
      firstName: normalizedProfile.firstName,
      lastName: normalizedProfile.lastName,
      avatar: normalizedProfile.avatar,
      provider: providerId,
      providerAccountId: normalizedProfile.id,
      raw: rawProfile
    }
  }

  /**
   * Merge profiles from multiple providers for the same user
   */
  static mergeProfiles(profiles: UserProfile[]): UserProfile {
    if (profiles.length === 0) {
      throw new Error('No profiles to merge')
    }

    if (profiles.length === 1) {
      return profiles[0]
    }

    const primaryProfile = profiles[0]
    const mergedProfile: UserProfile = { ...primaryProfile }

    // Merge data from other profiles
    for (let i = 1; i < profiles.length; i++) {
      const profile = profiles[i]
      
      // Use email from any provider that has it
      if (!mergedProfile.email && profile.email) {
        mergedProfile.email = profile.email
      }

      // Use name from primary profile, fallback to others
      if (!mergedProfile.name && profile.name) {
        mergedProfile.name = profile.name
      }

      // Use firstName/lastName from any provider that has them
      if (!mergedProfile.firstName && profile.firstName) {
        mergedProfile.firstName = profile.firstName
      }

      if (!mergedProfile.lastName && profile.lastName) {
        mergedProfile.lastName = profile.lastName
      }

      // Use avatar from primary profile, fallback to others
      if (!mergedProfile.avatar && profile.avatar) {
        mergedProfile.avatar = profile.avatar
      }
    }

    return mergedProfile
  }

  /**
   * Extract common fields from raw profile data
   */
  static extractCommonFields(rawProfile: any): Partial<UserProfile> {
    const commonFields: Partial<UserProfile> = {}

    // Common ID fields
    if (rawProfile.id) commonFields.id = rawProfile.id.toString()
    if (rawProfile.user_id) commonFields.id = rawProfile.user_id.toString()
    if (rawProfile.userId) commonFields.id = rawProfile.userId.toString()

    // Common email fields
    if (rawProfile.email) commonFields.email = rawProfile.email
    if (rawProfile.email_address) commonFields.email = rawProfile.email_address

    // Common name fields
    if (rawProfile.name) commonFields.name = rawProfile.name
    if (rawProfile.display_name) commonFields.name = rawProfile.display_name
    if (rawProfile.displayName) commonFields.name = rawProfile.displayName
    if (rawProfile.full_name) commonFields.name = rawProfile.full_name

    // Common display name fields
    if (rawProfile.username) commonFields.displayName = rawProfile.username
    if (rawProfile.login) commonFields.displayName = rawProfile.login
    if (rawProfile.screen_name) commonFields.displayName = rawProfile.screen_name

    // Common first/last name fields
    if (rawProfile.first_name) commonFields.firstName = rawProfile.first_name
    if (rawProfile.given_name) commonFields.firstName = rawProfile.given_name
    if (rawProfile.last_name) commonFields.lastName = rawProfile.last_name
    if (rawProfile.family_name) commonFields.lastName = rawProfile.family_name

    // Common avatar fields
    if (rawProfile.avatar_url) commonFields.avatar = rawProfile.avatar_url
    if (rawProfile.picture) commonFields.avatar = rawProfile.picture
    if (rawProfile.pictureUrl) commonFields.avatar = rawProfile.pictureUrl
    if (rawProfile.profile_image_url) commonFields.avatar = rawProfile.profile_image_url

    return commonFields
  }

  /**
   * Validate that a profile has required fields
   */
  static validateProfile(profile: UserProfile): { isValid: boolean; missingFields: string[] } {
    const requiredFields = ['id', 'name', 'provider', 'providerAccountId']
    const missingFields: string[] = []

    for (const field of requiredFields) {
      if (!profile[field as keyof UserProfile]) {
        missingFields.push(field)
      }
    }

    return {
      isValid: missingFields.length === 0,
      missingFields
    }
  }
}