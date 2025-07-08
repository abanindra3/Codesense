"use client"

import { useState } from "react"
import type { AnalysisResult } from "@/types/editor"

export function useFileOperations() {
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const uploadFile = async (file: File): Promise<string | null> => {
    setIsUploading(true)
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = () => reject(new Error("Failed to read file"))
        reader.readAsText(file)
      })
    } catch (error) {
      console.error("Failed to upload file:", error)
      return null
    } finally {
      setIsUploading(false)
    }
  }

  const downloadFile = async (content: string, filename: string) => {
    setIsDownloading(true)
    try {
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to download file:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const exportResults = async (results: AnalysisResult[], language: string) => {
    try {
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
      await downloadFile(content, `codesense-analysis-${Date.now()}.json`)
    } catch (error) {
      console.error("Failed to export results:", error)
    }
  }

  return {
    uploadFile,
    downloadFile,
    exportResults,
    isUploading,
    isDownloading,
  }
}
