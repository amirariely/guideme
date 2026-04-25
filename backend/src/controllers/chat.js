import Anthropic from '@anthropic-ai/sdk'
import { findBabyForUser } from './baby.js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function getBabyAgeText(dob) {
  const birth = new Date(dob)
  const now   = new Date()
  const weeks = Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 7))
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''}`
  const months = Math.floor(weeks / 4.3)
  return `${months} month${months !== 1 ? 's' : ''}`
}

function buildSystemPrompt(baby) {
  const babyAge = baby?.dob ? getBabyAgeText(baby.dob) : null
  const babyContext = baby?.name
    ? `The parent's baby is named ${baby.name}${babyAge ? `, currently ${babyAge} old` : ''}.
${baby.feedingMethods?.length ? `Feeding: ${baby.feedingMethods.join(', ')}.` : ''}
${baby.sensitivities?.length ? `Sensitivities: ${baby.sensitivities.join(', ')}.` : ''}
${baby.soothingPrefs?.length ? `Soothing: ${baby.soothingPrefs.join(', ')}.` : ''}`
    : ''

  return `You are GuideMe's parenting advisor — warm, knowledgeable, and concise.

ROLE: Answer questions about babies, toddlers, parenting, child development, family life, feeding, sleep, health, and general wellness.
${babyContext}

TOPIC RULES:
- ONLY answer questions related to babies, parenting, child development, family, feeding, sleep, health, postpartum, pregnancy, or general wellness.
- For unrelated topics respond: "I'm GuideMe's parenting advisor — I can only help with baby and family related questions. Is there something about ${baby?.name || 'your baby'} I can help with? 🌿"

FORMAT RULES:
- SHORT answers — 3 to 6 lines max.
- One direct answer line first, then bullet points (max 4) if needed.
- Max 1 emoji per response at the end.
- Add "Consult your pediatrician for urgent concerns." when relevant.`
}

// POST /api/chat
export async function sendMessage(req, res, next) {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' })
    }

    // Look up the baby profile for context
    const baby = await findBabyForUser(req.userId)

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 400,
      system: buildSystemPrompt(baby),
      messages: messages.map(m => ({
        role:    m.role,
        content: m.content,
      })),
    })

    const reply = response.content?.[0]?.text ?? "Sorry, I couldn't generate a response."

    res.json({
      id:      response.id,
      role:    'assistant',
      content: reply,
    })
  } catch (err) {
    if (err?.status === 401) {
      return res.status(500).json({ error: 'Invalid Anthropic API key — check backend .env' })
    }
    if (err?.status === 429) {
      return res.status(429).json({ error: 'Rate limited — please wait a moment' })
    }
    next(err)
  }
}
