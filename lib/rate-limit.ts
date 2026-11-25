const PER_MINUTE = 3
const PER_DAY = 20
const MINUTE_MS = 60_000
const KST_OFFSET_MS = 9 * 60 * 60 * 1000

// Free-tier guard: total AI calls allowed per KST day across all users.
const DAILY_AI_CALL_LIMIT = Number(process.env.DAILY_AI_CALL_LIMIT ?? 300)
// After the provider itself reports quota/rate exhaustion, pause issuing for this long.
const PROVIDER_COOLDOWN_MS = 30 * MINUTE_MS

type Bucket = { minuteHits: number[]; dayKey: string; dayCount: number }

// In-memory only (stateless MVP): counters reset on cold start and are per-instance.
const buckets = new Map<string, Bucket>()
const quota = { dayKey: '', calls: 0, pausedUntil: 0 }

function kstDayKey(now = Date.now()) {
  return new Date(now + KST_OFFSET_MS).toISOString().slice(0, 10)
}

function nextKstMidnight(now = Date.now()) {
  const kst = new Date(now + KST_OFFSET_MS)
  kst.setUTCHours(24, 0, 0, 0)
  return kst.getTime() - KST_OFFSET_MS
}

export function getClientIp(req: Request) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

export function checkRateLimit(ip: string): { ok: true } | { ok: false; scope: 'minute' | 'day' } {
  const now = Date.now()
  const dayKey = kstDayKey(now)

  if (buckets.size > 10_000) {
    for (const [key, b] of buckets) if (b.dayKey !== dayKey) buckets.delete(key)
  }

  let bucket = buckets.get(ip)
  if (!bucket || bucket.dayKey !== dayKey) {
    bucket = { minuteHits: [], dayKey, dayCount: 0 }
    buckets.set(ip, bucket)
  }

  bucket.minuteHits = bucket.minuteHits.filter((t) => now - t < MINUTE_MS)
  if (bucket.dayCount >= PER_DAY) return { ok: false, scope: 'day' }
  if (bucket.minuteHits.length >= PER_MINUTE) return { ok: false, scope: 'minute' }

  bucket.minuteHits.push(now)
  bucket.dayCount += 1
  return { ok: true }
}

export function isQuotaExhausted() {
  const now = Date.now()
  if (quota.pausedUntil > now) return true
  if (quota.dayKey !== kstDayKey(now)) {
    quota.dayKey = kstDayKey(now)
    quota.calls = 0
  }
  return quota.calls >= DAILY_AI_CALL_LIMIT
}

export function consumeQuota() {
  if (isQuotaExhausted()) return false
  quota.calls += 1
  return true
}

export function markProviderExhausted(untilMidnight = false) {
  const now = Date.now()
  quota.pausedUntil = untilMidnight ? nextKstMidnight(now) : now + PROVIDER_COOLDOWN_MS
}
