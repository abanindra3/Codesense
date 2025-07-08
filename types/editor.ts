export interface AnalysisResult {
  category: string
  severity: "low" | "medium" | "high"
  line: number
  message: string
  suggestion: string
  code?: string
  ruleId?: string
  documentation?: string
}

export interface AnalysisRequest {
  code: string
  language: string
  analysisTypes: string[]
  options?: {
    maxIssues?: number
    includeWarnings?: boolean
    customRules?: string[]
  }
}

export interface CodeSession {
  id: string
  name: string
  code: string
  language: string
  analysisTypes: string[]
  results: AnalysisResult[]
  createdAt: Date
  updatedAt?: Date
  tags?: string[]
  isPublic?: boolean
}

export interface UserPreferences {
  defaultLanguage: string
  defaultAnalysisTypes: string[]
  theme: "dark" | "light"
  autoSave: boolean
  showLineNumbers: boolean
  fontSize: number
}

// TODO: Add more types
// - ProjectSettings
// - TeamSettings
// - IntegrationConfig
// - CustomRule
// - AnalyticsData
