// ─────────────────────────────────────────────────────────────
// api/index.js — Real API layer (Stage 2)
//
// All calls go to the Express backend at VITE_API_URL.
// JWT token is stored in localStorage and sent with every request.
// ─────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// ── Helper ──────────────────────────────────────────────────
async function request(method, path, body) {
  const token = localStorage.getItem('guideme_token')
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: res.statusText }))
    const err = new Error(errorData.error || 'Request failed')
    err.status = res.status
    throw err
  }
  return res.json()
}

// ── Auth ─────────────────────────────────────────────────────

export const auth = {
  register: async (name, email, password) => {
    const data = await request('POST', '/api/auth/register', { name, email, password })
    localStorage.setItem('guideme_token', data.token)
    return data
  },

  login: async (email, password) => {
    const data = await request('POST', '/api/auth/login', { email, password })
    localStorage.setItem('guideme_token', data.token)
    return data
  },

  logout: async () => {
    localStorage.removeItem('guideme_token')
  },

  me: async () => {
    return request('GET', '/api/auth/me')
  },
}

// ── Baby Profile ─────────────────────────────────────────────

export const baby = {
  get: async () => {
    return request('GET', '/api/baby')
  },

  create: async (profile) => {
    return request('POST', '/api/baby', profile)
  },

  update: async (id, patch) => {
    return request('PATCH', `/api/baby/${id}`, patch)
  },
}

// ── Permissions ───────────────────────────────────────────────

export const permissions = {
  update: async (babyId, perms) => {
    return request('PATCH', `/api/baby/${babyId}/permissions`, perms)
  },
}

// ── Activity Log ─────────────────────────────────────────────

export const activities = {
  list: async ({ limit = 50, offset = 0 } = {}) => {
    return request('GET', `/api/activities?limit=${limit}&offset=${offset}`)
  },

  get: async (id) => {
    return request('GET', `/api/activities/${id}`)
  },

  create: async (activity) => {
    return request('POST', '/api/activities', activity)
  },

  remove: async (id) => {
    return request('DELETE', `/api/activities/${id}`)
  },
}

// ── AI Chat ──────────────────────────────────────────────────

export const chat = {
  send: async (messages) => {
    return request('POST', '/api/chat', { messages })
  },
}

// ── Partner Sync ─────────────────────────────────────────────

export const partner = {
  invite: async (email) => {
    return request('POST', '/api/partner/invite', { email })
  },

  get: async () => {
    return request('GET', '/api/partner')
  },

  pending: async () => {
    return request('GET', '/api/partner/pending')
  },

  accept: async (linkId) => {
    return request('PATCH', `/api/partner/${linkId}/accept`)
  },
}
