export function formatCode(code: string, language: string): string {
  switch (language) {
    case "javascript":
    case "typescript":
      return formatJavaScript(code)
    case "python":
      return formatPython(code)
    default:
      return code.trim()
  }
}

function formatJavaScript(code: string): string {
  // Basic JavaScript formatting
  return code
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim()
}

function formatPython(code: string): string {
  // Basic Python formatting
  return code
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim()
}
