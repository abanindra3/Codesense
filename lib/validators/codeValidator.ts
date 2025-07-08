export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateCode(code: string, language: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Basic validation
  if (!code.trim()) {
    errors.push("Code cannot be empty")
  }

  if (code.length > 100000) {
    errors.push("Code is too long (max 100,000 characters)")
  }

  // Language-specific validation
  switch (language) {
    case "javascript":
    case "typescript":
      validateJavaScript(code, errors, warnings)
      break
    case "python":
      validatePython(code, errors, warnings)
      break
    default:
      // Basic validation for other languages
      break
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

function validateJavaScript(code: string, errors: string[], warnings: string[]) {
  // Check for common issues
  if (code.includes("eval(")) {
    warnings.push("Use of eval() detected - potential security risk")
  }

  if (code.includes("document.write")) {
    warnings.push("Use of document.write() detected - consider alternatives")
  }

  // Basic syntax validation would go here
  // For now, just check for basic structure
  const hasFunction = code.includes("function") || code.includes("=>")
  const hasVariable = code.includes("var") || code.includes("let") || code.includes("const")

  if (!hasFunction && !hasVariable && code.trim().length > 10) {
    warnings.push("Code might be missing function or variable declarations")
  }
}

function validatePython(code: string, errors: string[], warnings: string[]) {
  const lines = code.split("\n")

  // Check for basic Python structure
  let hasFunction = false
  let hasImport = false

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("def ")) {
      hasFunction = true
    }
    if (trimmed.startsWith("import ") || trimmed.startsWith("from ")) {
      hasImport = true
    }
  }

  if (!hasFunction && !hasImport && code.trim().length > 20) {
    warnings.push("Consider organizing code into functions")
  }
}
