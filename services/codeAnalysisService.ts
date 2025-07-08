import type { AnalysisRequest, AnalysisResult } from "@/types/editor"

export async function analyzeCodeService(request: AnalysisRequest): Promise<AnalysisResult[]> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data.results || []
}

// TODO: Add more analysis service functions
// - Real-time analysis
// - Batch analysis
// - Custom rule analysis
// - Integration with external tools (ESLint, Pylint, etc.)
