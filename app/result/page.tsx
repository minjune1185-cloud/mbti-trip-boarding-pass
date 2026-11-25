import type { Metadata } from 'next'
import { ResultView } from '@/components/result-view'

export const metadata: Metadata = { title: '내 보딩패스 | 성격따라 따라가는 여행' }

export default function ResultPage() {
  return <ResultView />
}
