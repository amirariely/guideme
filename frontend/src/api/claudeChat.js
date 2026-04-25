const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

function buildSystemPrompt(baby) {
  const babyAge = baby?.dob ? getBabyAgeText(baby.dob) : null
  const babyContext = baby?.name
    ? `The parent's baby is named ${baby.name}${babyAge ? `, currently ${babyAge} old` : ''}.
${baby.feedingMethod?.length ? `Feeding: ${Array.isArray(baby.feedingMethod) ? baby.feedingMethod.join(', ') : baby.feedingMethod}.` : ''}
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

function getBabyAgeText(dob) {
  const birth = new Date(dob)
  const now = new Date()
  const weeks = Math.floor((now - birth) / (1000 * 60 * 60 * 24 * 7))
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''}`
  const months = Math.floor(weeks / 4.3)
  return `${months} month${months !== 1 ? 's' : ''}`
}

export async function sendChatMessage(messages, baby) {
  if (!ANTHROPIC_API_KEY) throw new Error('NO_API_KEY')

  let response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 400,
        system: buildSystemPrompt(baby),
        messages: messages.map(m => ({ role: m.role, content: m.content })),
      }),
    })
  } catch (networkErr) {
    throw new Error('NETWORK_ERROR')
  }

  if (!response.ok) {
    const errText = await response.text()
    if (response.status === 401) throw new Error('INVALID_KEY')
    if (response.status === 429) throw new Error('RATE_LIMIT')
    throw new Error(`API_ERROR_${response.status}: ${errText}`)
  }

  const data = await response.json()
  return data.content?.[0]?.text ?? "Sorry, I couldn't get a response. Please try again."
}
