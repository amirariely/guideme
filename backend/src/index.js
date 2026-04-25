import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import { fileURLToPath } from 'url'
import path from 'path'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import authRoutes       from './routes/auth.js'
import babyRoutes       from './routes/baby.js'
import activitiesRoutes from './routes/activities.js'
import chatRoutes       from './routes/chat.js'
import partnerRoutes    from './routes/partner.js'
import { errorHandler } from './middleware/errorHandler.js'

const app  = express()
const PORT = process.env.PORT || 3001


// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

// ── Serve Landing Page ────────────────────────────────────
app.use(express.static('src/public'))
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

// ── Routes ────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes)
app.use('/api/baby',       babyRoutes)
app.use('/api/activities', activitiesRoutes)
app.use('/api/chat',       chatRoutes)
app.use('/api/partner',    partnerRoutes)

// ── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// ── Error handler (must be last) ──────────────────────────────
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`✅ GuideMe backend running on http://localhost:${PORT}`)
})
