export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateAnalysisRequest(body: any): ValidationResult {
  const errors: string[] = []

  if (!body.code || typeof body.code !== "string") {
    errors.push("Code is required and must be a string")
  }

  if (!body.language || typeof body.language !== "string") {
    errors.push("Language is required and must be a string")
  }

  if (!Array.isArray(body.analysisTypes) || body.analysisTypes.length === 0) {
    errors.push("Analysis types are required and must be a non-empty array")
  }

  if (body.code && body.code.length > 100000) {
    errors.push("Code is too long (maximum 100,000 characters)")
  }

  const validLanguages = ["javascript", "python", "typescript", "java", "cpp", "go", "rust", "php"]
  if (body.language && !validLanguages.includes(body.language)) {
    errors.push("Invalid language specified")
  }

  const validAnalysisTypes = ["bugs", "performance", "security", "style"]
  if (body.analysisTypes && Array.isArray(body.analysisTypes)) {
    const invalidTypes = body.analysisTypes.filter((type: string) => !validAnalysisTypes.includes(type))
    if (invalidTypes.length > 0) {
      errors.push(`Invalid analysis types: ${invalidTypes.join(", ")}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}
