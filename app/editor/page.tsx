"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Code2,
  Play,
  Loader2,
  Bug,
  Zap,
  Shield,
  Palette,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Copy,
  ArrowLeft,
  Sparkles,
  Target,
} from "lucide-react"
import Link from "next/link"
import Editor from "@monaco-editor/react"

const languages = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "php", label: "PHP" },
]

const analysisTypes = [
  { id: "bugs", label: "Bug Detection", icon: Bug, color: "text-red-400" },
  { id: "performance", label: "Performance", icon: Zap, color: "text-yellow-400" },
  { id: "security", label: "Security", icon: Shield, color: "text-green-400" },
  { id: "style", label: "Style Guide", icon: Palette, color: "text-blue-400" },
]

const sampleCode = {
  javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Potential issues:
// 1. No input validation
// 2. Inefficient recursive approach
// 3. Stack overflow for large n
console.log(fibonacci(40));`,
  python: `def process_data(data):
    result = []
    for i in range(len(data)):
        if data[i] > 0:
            result.append(data[i] * 2)
    return result

# Issues to detect:
# 1. Inefficient loop
# 2. No error handling
# 3. Could use list comprehension
data = [1, -2, 3, 4, -5]
print(process_data(data))`,
}

interface AnalysisResult {
  category: string
  severity: "low" | "medium" | "high"
  line: number
  message: string
  suggestion: string
  code?: string
}

export default function EditorPage() {
  const [code, setCode] = useState(sampleCode.javascript)
  const [language, setLanguage] = useState("javascript")
  const [selectedAnalysis, setSelectedAnalysis] = useState(["bugs", "performance", "security", "style"])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult[]>([])
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const editorRef = useRef(null)

  // Suppress "ResizeObserver loop completed with undelivered notifications" error
  useEffect(() => {
    const handler = (e: ErrorEvent) => {
      if (
        e.message === "ResizeObserver loop completed with undelivered notifications." ||
        e.message === "ResizeObserver loop limit exceeded"
      ) {
        // Prevent the error from bubbling and breaking the app
        e.stopImmediatePropagation()
      }
    }
    window.addEventListener("error", handler)

    // Some browsers (e.g. Chromium-based) dispatch a special event name
    window.addEventListener("unhandledrejection", handler as any)

    return () => {
      window.removeEventListener("error", handler)
      window.removeEventListener("unhandledrejection", handler as any)
    }
  }, [])

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage)
    if (sampleCode[newLanguage as keyof typeof sampleCode]) {
      setCode(sampleCode[newLanguage as keyof typeof sampleCode])
    }
    setResults([])
    setAnalysisComplete(false)
  }

  const toggleAnalysisType = (type: string) => {
    setSelectedAnalysis((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const analyzeCode = async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)
    setResults([])

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          analysisTypes: selectedAnalysis,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data.results || [])
        setAnalysisComplete(true)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
      // Mock results for demo
      const mockResults: AnalysisResult[] = [
        {
          category: "performance",
          severity: "high",
          line: 3,
          message: "Inefficient recursive algorithm detected",
          suggestion: "Consider using dynamic programming or iterative approach",
          code: "function fibonacci(n) {\n  const dp = [0, 1];\n  for (let i = 2; i <= n; i++) {\n    dp[i] = dp[i-1] + dp[i-2];\n  }\n  return dp[n];\n}",
        },
        {
          category: "bugs",
          severity: "medium",
          line: 2,
          message: "Missing input validation",
          suggestion: "Add type checking and range validation for parameter n",
        },
        {
          category: "security",
          severity: "low",
          line: 7,
          message: "Potential stack overflow vulnerability",
          suggestion: "Implement maximum recursion depth limit",
        },
      ]
      setResults(mockResults)
      setAnalysisComplete(true)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />
      case "low":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      default:
        return <CheckCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getCategoryIcon = (category: string) => {
    const type = analysisTypes.find((t) => t.id === category)
    if (!type) return <Bug className="w-4 h-4" />
    return <type.icon className={`w-4 h-4 ${type.color}`} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Code2 className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold">CodeSense</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
              AI Ready
            </Badge>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
          {/* Code Editor Panel */}
          <Card className="bg-gray-800/50 border-gray-700/50 flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Code2 className="w-5 h-5 text-purple-400" />
                  <span>Code Editor</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-40 bg-gray-700 border-gray-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Analysis Type Selection */}
              <div className="flex flex-wrap gap-2 mt-4">
                {analysisTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedAnalysis.includes(type.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAnalysisType(type.id)}
                    className={`${
                      selectedAnalysis.includes(type.id)
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "border-gray-600 hover:bg-gray-700"
                    }`}
                  >
                    <type.icon className={`w-4 h-4 mr-2 ${type.color}`} />
                    {type.label}
                  </Button>
                ))}
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-0">
              <div className="h-full border border-gray-700 rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                  }}
                />
              </div>

              <div className="p-4 border-t border-gray-700">
                <Button
                  onClick={analyzeCode}
                  disabled={isAnalyzing || !code.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Analyze Code
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="bg-gray-800/50 border-gray-700/50 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Analysis Results</span>
                {results.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {results.length} issues found
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {!analysisComplete && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
                      <Play className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
                    <p className="text-gray-400 max-w-sm">
                      Paste your code and click "Analyze Code" to get AI-powered insights and suggestions.
                    </p>
                  </motion.div>
                )}

                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Analyzing Your Code</h3>
                    <p className="text-gray-400 max-w-sm">
                      Our AI is reviewing your code for bugs, performance issues, security vulnerabilities, and style
                      improvements...
                    </p>
                  </motion.div>
                )}

                {analysisComplete && results.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Great Code!</h3>
                    <p className="text-gray-400 max-w-sm">
                      No issues found in your code. It follows best practices for the selected analysis types.
                    </p>
                  </motion.div>
                )}

                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-full overflow-y-auto space-y-4"
                  >
                    {results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-gray-700/50 border-gray-600/50 hover:bg-gray-700/70 transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className="flex items-center space-x-2 mt-1">
                                {getSeverityIcon(result.severity)}
                                {getCategoryIcon(result.category)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    Line {result.line}
                                  </Badge>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${
                                      result.severity === "high"
                                        ? "bg-red-500/20 text-red-400"
                                        : result.severity === "medium"
                                          ? "bg-yellow-500/20 text-yellow-400"
                                          : "bg-green-500/20 text-green-400"
                                    }`}
                                  >
                                    {result.severity.toUpperCase()}
                                  </Badge>
                                </div>
                                <h4 className="font-semibold text-white mb-2">{result.message}</h4>
                                <p className="text-gray-300 text-sm mb-3">{result.suggestion}</p>
                                {result.code && (
                                  <div className="bg-gray-800 rounded-lg p-3 mt-3">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-xs text-gray-400">Suggested fix:</span>
                                      <Button size="sm" variant="ghost" className="h-6 px-2">
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                    <pre className="text-xs text-gray-300 overflow-x-auto">
                                      <code>{result.code}</code>
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
