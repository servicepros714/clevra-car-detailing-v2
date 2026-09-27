import { SLOT_START_MIN, SLOT_END_MIN, SLOT_STEP, LEAD_MINUTES } from '../config'

// Current wall-clock time in California, as { dateKey: 'yyyy-MM-dd', minutes }
export function nowInCalifornia() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t) => parts.find((p) => p.type === t)?.value
  return {
    dateKey: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  }
}

export function toLabel(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  const h12 = ((h + 11) % 12) + 1
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

export function allSlots() {
  const out = []
  for (let m = SLOT_START_MIN; m <= SLOT_END_MIN; m += SLOT_STEP) out.push({ min: m, label: toLabel(m) })
  return out
}

// Slots for a given date key with past/lead-time slots flagged
export function slotsFor(dateKey) {
  const now = nowInCalifornia()
  return allSlots().map((s) => ({
    ...s,
    past: dateKey < now.dateKey || (dateKey === now.dateKey && s.min < now.minutes + LEAD_MINUTES),
  }))
}

export function dayHasOpenSlot(dateKey) {
  return slotsFor(dateKey).some((s) => !s.past)
}
