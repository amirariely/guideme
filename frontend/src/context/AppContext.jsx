import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { auth as authApi, baby as babyApi, activities as activitiesApi } from '../api/index.js'

const initialState = {
  // Auth
  isAuthenticated: false,
  user: null,
  loading: true, // true on startup while we check for existing session

  // Baby profile
  baby: {
    id: null,
    name: '',
    dob: '',
    feedingMethod: [],
    isPremature: false,
    dueDateIfPremature: '',
    sensitivities: [],
    soothingPrefs: [],
    sensitiveToLight: false,
    sensitiveToNoise: false,
    routinePreference: '',
  },

  // AI permissions (local UI state — also saved to DB)
  permissions: {
    microphone: false,
    notifications: false,
  },

  // Activity log
  activities: [],

  // UI state
  sleepZoneActive: false,
}

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, setState] = useState(initialState)

  const update = (patch) => setState(prev => ({ ...prev, ...patch }))

  const updateBaby = (patch) =>
    setState(prev => ({ ...prev, baby: { ...prev.baby, ...patch } }))

  const updatePermissions = (patch) =>
    setState(prev => ({ ...prev, permissions: { ...prev.permissions, ...patch } }))

  const toggleSleepZone = () =>
    setState(prev => ({ ...prev, sleepZoneActive: !prev.sleepZoneActive }))

  // ── Load existing session on startup ───────────────────────
  const loadSession = useCallback(async () => {
    const token = localStorage.getItem('guideme_token')
    if (!token) {
      update({ loading: false })
      return
    }

    try {
      const { user } = await authApi.me()
      const { baby } = await babyApi.get()
      let activities = []
      if (baby) {
        const result = await activitiesApi.list({ limit: 50 })
        activities = result.activities || []
      }

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user,
        baby: baby ? {
          id: baby.id,
          name: baby.name,
          dob: baby.dob?.slice(0, 10) || '',
          feedingMethod: baby.feedingMethods || [],
          isPremature: baby.isPremature,
          dueDateIfPremature: baby.dueDateIfPremature?.slice(0, 10) || '',
          sensitivities: baby.sensitivities || [],
          soothingPrefs: baby.soothingPrefs || [],
          sensitiveToLight: baby.sensitiveToLight,
          sensitiveToNoise: baby.sensitiveToNoise,
          routinePreference: baby.routinePreference || '',
        } : prev.baby,
        permissions: baby ? {
          microphone: baby.micEnabled,
          notifications: baby.notificationsEnabled,
        } : prev.permissions,
        activities: activities.map(a => ({
          ...a,
          time: formatRelativeTime(a.timestamp),
        })),
        loading: false,
      }))
    } catch {
      // Token expired or invalid — clear it
      localStorage.removeItem('guideme_token')
      update({ loading: false })
    }
  }, [])

  useEffect(() => { loadSession() }, [loadSession])

  // ── Auth ────────────────────────────────────────────────────
  const register = async (name, email, password) => {
    const data = await authApi.register(name, email, password)
    update({
      isAuthenticated: true,
      user: data.user,
    })
    return data
  }

  const login = async (email, password) => {
    const data = await authApi.login(email, password)
    update({ isAuthenticated: true, user: data.user })

    // Load baby + activities after login
    try {
      const { baby } = await babyApi.get()
      if (baby) {
        updateBaby({
          id: baby.id,
          name: baby.name,
          dob: baby.dob?.slice(0, 10) || '',
          feedingMethod: baby.feedingMethods || [],
          isPremature: baby.isPremature,
          dueDateIfPremature: baby.dueDateIfPremature?.slice(0, 10) || '',
          sensitivities: baby.sensitivities || [],
          soothingPrefs: baby.soothingPrefs || [],
          sensitiveToLight: baby.sensitiveToLight,
          sensitiveToNoise: baby.sensitiveToNoise,
          routinePreference: baby.routinePreference || '',
        })
        updatePermissions({
          microphone: baby.micEnabled,
          notifications: baby.notificationsEnabled,
        })
        const result = await activitiesApi.list({ limit: 50 })
        update({
          activities: (result.activities || []).map(a => ({
            ...a,
            time: formatRelativeTime(a.timestamp),
          })),
        })
      }
    } catch {
      // Baby profile doesn't exist yet — that's fine
    }

    return data
  }

  const logout = async () => {
    await authApi.logout()
    setState({ ...initialState, loading: false })
  }

  // ── Baby profile (save to backend) ──────────────────────────
  const saveBabyProfile = async (babyData) => {
    const payload = {
      name: babyData.name,
      dob: babyData.dob,
      isPremature: babyData.isPremature,
      dueDateIfPremature: babyData.dueDateIfPremature || null,
      feedingMethods: Array.isArray(babyData.feedingMethod) ? babyData.feedingMethod : [],
      sensitivities: babyData.sensitivities || [],
      soothingPrefs: babyData.soothingPrefs || [],
      sensitiveToLight: babyData.sensitiveToLight || false,
      sensitiveToNoise: babyData.sensitiveToNoise || false,
      routinePreference: babyData.routinePreference || null,
    }

    let baby
    if (state.baby.id) {
      const result = await babyApi.update(state.baby.id, payload)
      baby = result.baby
    } else {
      const result = await babyApi.create(payload)
      baby = result.baby
    }

    updateBaby({ id: baby.id })
    return baby
  }

  // ── Permissions (save to backend) ───────────────────────────
  const savePermissions = async (perms) => {
    if (state.baby.id) {
      await import('../api/index.js').then(api =>
        api.permissions.update(state.baby.id, {
          micEnabled: perms.microphone,
          notificationsEnabled: perms.notifications,
        })
      )
    }
    updatePermissions(perms)
  }

  // ── Activities ──────────────────────────────────────────────
  const addActivity = async (activity) => {
    try {
      const result = await activitiesApi.create(activity)
      const newActivity = {
        ...result.activity,
        time: 'just now',
      }
      setState(prev => ({
        ...prev,
        activities: [newActivity, ...prev.activities],
      }))
      return newActivity
    } catch {
      // Fallback to local-only if backend fails
      const local = { id: Date.now().toString(), ...activity, time: 'just now', timestamp: new Date().toISOString() }
      setState(prev => ({
        ...prev,
        activities: [local, ...prev.activities],
      }))
      return local
    }
  }

  const removeActivity = async (id) => {
    try {
      await activitiesApi.remove(id)
    } catch {
      // ignore — remove from local anyway
    }
    setState(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id),
    }))
  }

  const reloadActivities = async () => {
    try {
      const result = await activitiesApi.list({ limit: 50 })
      update({
        activities: (result.activities || []).map(a => ({
          ...a,
          time: formatRelativeTime(a.timestamp),
        })),
      })
    } catch {
      // keep current
    }
  }

  return (
    <AppContext.Provider value={{
      state, update, updateBaby, updatePermissions, addActivity, removeActivity,
      toggleSleepZone, login, register, logout, saveBabyProfile, savePermissions,
      reloadActivities,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)

// ── Helpers ───────────────────────────────────────────────────

function formatRelativeTime(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'yesterday'
  return `${days}d ago`
}
