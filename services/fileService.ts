import type { AnalysisResult } from "@/types/editor"

class FileService {
  async readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsText(file)
    })
  }

  async downloadFile(content: string, filename: string): Promise<void> {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  async exportAnalysisResults(results: AnalysisResult[], language: string): Promise<void> {
    const exportData = {
      timestamp: new Date().toISOString(),
      language,
      totalIssues: results.length,
      results: results.map((result) => ({
        ...result,
        timestamp: new Date().toISOString(),
      })),
    }

    const content = JSON.stringify(exportData, null, 2)
    await this.downloadFile(content, `codesense-analysis-${Date.now()}.json`)
  }

  // TODO: Add more file operations
  // - uploadToCloud()
  // - compressFiles()
  // - validateFileType()
  // - extractMetadata()
}

export const fileService = new FileService()
