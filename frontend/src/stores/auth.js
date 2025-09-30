import { reactive, computed } from 'vue'

const STORAGE_KEY = 'acme-auth-user'

function readStoredUser() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.warn('Failed to read stored user', error)
    return null
  }
}

function persistUser(user) {
  if (typeof window === 'undefined') return
  try {
    if (user) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  } catch (error) {
    console.warn('Failed to persist user', error)
  }
}

const state = reactive({
  user: readStoredUser(),
})

function setUser(user) {
  state.user = user
  persistUser(user)
}

export function useAuth() {
  const login = ({ name, email }) => {
    if (!email) {
      throw new Error('Email is required')
    }

    const safeName = name?.trim() || email.split('@')[0]
    const user = {
      name: safeName,
      email,
      loggedInAt: new Date().toISOString(),
    }

    setUser(user)
    return user
  }

  const logout = () => {
    setUser(null)
  }

  return {
    user: computed(() => state.user),
    isAuthenticated: computed(() => Boolean(state.user)),
    login,
    logout,
  }
}

export function isAuthenticated() {
  return Boolean(state.user)
}
