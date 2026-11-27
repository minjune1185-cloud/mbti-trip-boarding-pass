import { neon } from '@neondatabase/serverless'
import { z } from 'zod'
import { MBTI_TYPES } from '@/lib/options'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export type GuestbookEntry = {
  id: number
  nickname: string
  mbti: string | null
  country: string | null
  message: string
  created_at: string
}

const createEntrySchema = z.object({
  nickname: z
    .string()
    .trim()
    .max(20, '닉네임은 20자 이내로 입력해 주세요.')
    .optional()
    .transform((v) => (v && v.length > 0 ? v : '익명 여행자')),
  mbti: z.enum(MBTI_TYPES).nullable().optional(),
  country: z.string().trim().max(30).nullable().optional(),
  message: z
    .string()
    .trim()
    .min(1, '댓글 내용을 입력해 주세요.')
    .max(200, '댓글은 200자 이내로 입력해 주세요.'),
})

let tableInitialized = false

function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL
  if (!url) {
    throw new Error('DATABASE_URL is not configured')
  }
  return neon(url)
}

async function ensureTable() {
  const sql = getSql()
  if (!tableInitialized) {
    await sql`
      CREATE TABLE IF NOT EXISTS guestbook_entries (
        id SERIAL PRIMARY KEY,
        nickname VARCHAR(40) NOT NULL DEFAULT '익명 여행자',
        mbti VARCHAR(10),
        country VARCHAR(40),
        message VARCHAR(300) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `
    tableInitialized = true
  }
  return sql
}

export async function GET() {
  try {
    const sql = await ensureTable()
    const rows = await sql`
      SELECT id, nickname, mbti, country, message, created_at
      FROM guestbook_entries
      ORDER BY created_at DESC
      LIMIT 30
    `
    return Response.json({ entries: rows })
  } catch (err) {
    console.error('[guestbook GET] error:', err instanceof Error ? err.message : err)
    return Response.json({ error: 'FAILED_TO_LOAD' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const limit = checkRateLimit(`guestbook:${getClientIp(req)}`)
  if (!limit.ok) {
    return Response.json({ error: 'RATE_LIMITED' }, { status: 429 })
  }

  const body = await req.json().catch(() => null)
  const parsed = createEntrySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    const sql = await ensureTable()
    const { nickname, mbti, country, message } = parsed.data
    const rows = await sql`
      INSERT INTO guestbook_entries (nickname, mbti, country, message)
      VALUES (${nickname}, ${mbti ?? null}, ${country ?? null}, ${message})
      RETURNING id, nickname, mbti, country, message, created_at
    `
    return Response.json({ entry: rows[0] }, { status: 201 })
  } catch (err) {
    console.error('[guestbook POST] error:', err instanceof Error ? err.message : err)
    return Response.json({ error: 'FAILED_TO_CREATE' }, { status: 500 })
  }
}
