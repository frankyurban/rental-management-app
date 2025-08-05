import { Suspense } from 'react'
import ReturnAnalysisContent from './ReturnAnalysisContent'

export default function ReturnAnalysisPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto py-10 px-2">Loading...</div>}>
      <ReturnAnalysisContent />
    </Suspense>
  )
}
