"use client"

import { useState } from "react"
import type { AnalysisResult, AnalysisRequest } from "@/types/editor"

export function useCodeAnalysis() {
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeCode = async (request: AnalysisRequest) => {
    setIsAnalyzing(true)
    setError(null)
    setResults([])

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data.results || [])
      setAnalysisComplete(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed")
      // Fallback to mock results for demo
      setResults([
        {
          category: "performance",
          severity: "high",
          line: 3,
          message: "Inefficient recursive algorithm detected",
          suggestion: "Consider using dynamic programming or iterative approach",
          code: "// Optimized version\nfunction fibonacci(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}",
        },
      ])
      setAnalysisComplete(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearResults = () => {
    setResults([])
    setAnalysisComplete(false)
    setError(null)
  }

  return {
    results,
    isAnalyzing,
    analysisComplete,
    error,
    analyzeCode,
    clearResults,
  }
}
