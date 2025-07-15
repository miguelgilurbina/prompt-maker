// Temporary token storage for password reset functionality
// In production, these should be stored in the database

interface ResetToken {
  email: string
  token: string
  expires: Date
  used: boolean
}

// In-memory storage (for development only)
// In production, this should be stored in the database
const tokenStorage = new Map<string, ResetToken>()

export const tokenStore = {
  // Store a reset token
  store: (email: string, token: string, expires: Date): void => {
    tokenStorage.set(token, {
      email,
      token,
      expires,
      used: false
    })
  },

  // Retrieve a token
  get: (token: string): ResetToken | null => {
    return tokenStorage.get(token) || null
  },

  // Mark token as used
  markAsUsed: (token: string): boolean => {
    const tokenData = tokenStorage.get(token)
    if (tokenData) {
      tokenData.used = true
      tokenStorage.set(token, tokenData)
      return true
    }
    return false
  },

  // Validate token
  isValid: (token: string): boolean => {
    const tokenData = tokenStorage.get(token)
    if (!tokenData) return false
    if (tokenData.used) return false
    if (new Date() > tokenData.expires) return false
    return true
  },

  // Clean up expired tokens (optional utility)
  cleanup: (): void => {
    const now = new Date()
    for (const [token, data] of tokenStorage.entries()) {
      if (data.expires < now || data.used) {
        tokenStorage.delete(token)
      }
    }
  },

  // Get all tokens (for debugging)
  getAll: (): ResetToken[] => {
    return Array.from(tokenStorage.values())
  }
}
