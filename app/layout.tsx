import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Noto_Sans_KR } from 'next/font/google'
import { TripProvider } from '@/components/trip-provider'
import './globals.css'

const notoKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-kr',
})

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: '성격따라 따라가는 여행 | AI 밈 여행지 보딩패스',
  description:
    '여행 조건과 MBTI를 고르면 AI가 한국인 인기 30개국 중 딱 맞는 여행지를 밈 보딩패스로 발권해 드려요.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'light',
  themeColor: '#f3efe6',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${notoKr.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <TripProvider>
          <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-background md:shadow-[0_0_0_1px_var(--border)]">
            {children}
          </div>
        </TripProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
