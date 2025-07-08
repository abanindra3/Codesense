import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

// Validate environment variables
if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
  console.error("GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set")
}

// Create Google Generative AI provider instance with API key
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

// Types for better type safety
interface AnalysisRequest {
  code: string
  language: string
  analysisTypes: string[]
}

interface AnalysisResult {
  category: "bugs" | "performance" | "security" | "style"
  severity: "low" | "medium" | "high"
  line: number
  message: string
  suggestion: string
  code?: string
}

interface AnalysisResponse {
  results: AnalysisResult[]
}

// Helper function to safely handle unknown errors
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unknown error occurred'
}

function isErrorOfType(error: unknown, type: string): boolean {
  if (error instanceof Error) {
    return error.message.toLowerCase().includes(type.toLowerCase())
  }
  return false
}

// Mock data generator for development/fallback
function generateMockResults(code: string, language: string, analysisTypes: string[]): AnalysisResult[] {
  const mockResults: AnalysisResult[] = []
  const lines = code.split('\n')
  
  if (analysisTypes.includes("bugs")) {
    mockResults.push({
      category: "bugs",
      severity: "medium",
      line: Math.min(2, lines.length),
      message: "Potential null reference error",
      suggestion: "Add null checking before accessing object properties to prevent runtime errors",
    })
  }

  if (analysisTypes.includes("performance")) {
    mockResults.push({
      category: "performance",
      severity: "high",
      line: Math.min(3, lines.length),
      message: "Inefficient algorithm detected",
      suggestion: "Consider using a more efficient algorithm or data structure to improve performance",
      code: language === "javascript" ? 
        "// Example optimization\nconst memoized = new Map();\nfunction optimizedFunction(n) {\n  if (memoized.has(n)) return memoized.get(n);\n  // ... computation\n  memoized.set(n, result);\n  return result;\n}" :
        "# Example optimization\ndef optimized_function(n, memo={}):\n    if n in memo:\n        return memo[n]\n    # ... computation\n    memo[n] = result\n    return result"
    })
  }

  if (analysisTypes.includes("security")) {
    mockResults.push({
      category: "security",
      severity: "low",
      line: Math.min(5, lines.length),
      message: "Potential security vulnerability",
      suggestion: "Validate and sanitize all user inputs to prevent injection attacks",
    })
  }

  if (analysisTypes.includes("style")) {
    mockResults.push({
      category: "style",
      severity: "low",
      line: 1,
      message: "Missing documentation",
      suggestion: "Add proper documentation and comments to improve code readability",
    })
  }

  return mockResults
}

// Validate analysis types
const VALID_ANALYSIS_TYPES = ["bugs", "performance", "security", "style"]
const VALID_LANGUAGES = [
  "javascript", "typescript", "python", "java", "cpp", "go", "rust", "php"
]

// Rate limiting (basic implementation)
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_COUNT = 15 // 15 requests per minute per IP (Gemini is more generous)

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const userRequests = requestCounts.get(ip)
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }
  
  if (userRequests.count >= RATE_LIMIT_COUNT) {
    return false
  }
  
  userRequests.count++
  return true
}

function validateRequest(data: any): data is AnalysisRequest {
  return (
    typeof data.code === "string" &&
    data.code.trim().length > 0 &&
    data.code.length <= 10000 && // Max 10KB code
    typeof data.language === "string" &&
    VALID_LANGUAGES.includes(data.language) &&
    Array.isArray(data.analysisTypes) &&
    data.analysisTypes.length > 0 &&
    data.analysisTypes.every((type: any) => VALID_ANALYSIS_TYPES.includes(type))
  )
}

function sanitizeCode(code: string): string {
  // Remove potential security risks and normalize
  return code
    .replace(/[^\x20-\x7E\n\r\t]/g, '') // Remove non-printable characters except newlines and tabs
    .substring(0, 10000) // Ensure max length
    .trim()
}

function parseAIResponse(text: string): AnalysisResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No JSON found in response")
    }
    
    const parsed = JSON.parse(jsonMatch[0])
    
    // Validate the structure
    if (!parsed.results || !Array.isArray(parsed.results)) {
      throw new Error("Invalid response structure")
    }
    
    // Validate and sanitize each result
    const validResults: AnalysisResult[] = parsed.results
      .filter((result: any) => 
        typeof result.category === "string" &&
        VALID_ANALYSIS_TYPES.includes(result.category as any) &&
        typeof result.severity === "string" &&
        ["low", "medium", "high"].includes(result.severity) &&
        typeof result.line === "number" &&
        result.line > 0 &&
        typeof result.message === "string" &&
        typeof result.suggestion === "string"
      )
      .map((result: any) => ({
        category: result.category,
        severity: result.severity,
        line: Math.max(1, Math.floor(result.line)),
        message: result.message.substring(0, 200), // Limit message length
        suggestion: result.suggestion.substring(0, 500), // Limit suggestion length
        code: result.code ? result.code.substring(0, 1000) : undefined // Limit code length
      }))
    
    return { results: validResults }
  } catch (error) {
    console.error("Failed to parse AI response:", error)
    return {
      results: [
        {
          category: "bugs",
          severity: "medium",
          line: 1,
          message: "AI response could not be parsed",
          suggestion: "The AI analysis service encountered an error. Please try again with different code or contact support if the issue persists.",
        },
      ],
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || 
              request.headers.get("x-real-ip") || 
              "unknown"
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." }, 
        { status: 429 }
      )
    }
    
    // Parse and validate request
    const body = await request.json()
    
    if (!validateRequest(body)) {
      return NextResponse.json(
        { error: "Invalid request. Please check your code, language, and analysis types." }, 
        { status: 400 }
      )
    }
    
    const { code, language, analysisTypes } = body
    const sanitizedCode = sanitizeCode(code)
    
    // Check if Gemini API key is available
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("No Gemini API key found, using mock data")
      const mockResults = generateMockResults(sanitizedCode, language, analysisTypes)
      return NextResponse.json({ results: mockResults })
    }
    
    // Create more structured prompt optimized for Gemini
    const prompt = `You are an expert code reviewer with extensive experience in ${language} programming. Analyze the following code for these specific issues: ${analysisTypes.join(", ")}.

Code to analyze:
\`\`\`${language}
${sanitizedCode}
\`\`\`

Analysis Requirements:
1. Focus ONLY on these analysis types: ${analysisTypes.join(", ")}
2. Provide accurate line numbers that correspond to the actual code lines
3. Give specific, actionable suggestions for improvement
4. Include improved code snippets when helpful
5. Prioritize the most impactful issues first

Response Format:
Return your analysis as valid JSON in exactly this format (no markdown, no additional text):

{
  "results": [
    {
      "category": "bugs|performance|security|style",
      "severity": "low|medium|high",
      "line": actual_line_number,
      "message": "Brief, specific description of the issue",
      "suggestion": "Detailed, actionable suggestion for improvement",
      "code": "Optional: improved code snippet if helpful"
    }
  ]
}

Important:
- If no issues are found, return: {"results": []}
- Only include findings for the requested analysis types: ${analysisTypes.join(", ")}
- Be precise with line numbers
- Focus on practical, implementable suggestions`

    try {
      // Call Gemini with appropriate settings
      const { text } = await generateText({
        model: google("models/gemini-1.5-flash"), // Free tier model
        prompt,
        temperature: 0.1, // Lower temperature for more consistent output
        maxTokens: 2000, // Limit response length
      })
      
      const analysisResult = parseAIResponse(text)
      
      // Add response headers
      const response = NextResponse.json(analysisResult)
      response.headers.set('Cache-Control', 'no-cache')
      response.headers.set('X-Analysis-Types', analysisTypes.join(','))
      response.headers.set('X-Language', language)
      response.headers.set('X-AI-Provider', 'gemini')
      
      return response
      
    } catch (aiError) {
      console.error("Gemini API error:", aiError)
      
      // Fallback to mock data if AI fails
      console.log("Gemini API failed, using mock data as fallback")
      const mockResults = generateMockResults(sanitizedCode, language, analysisTypes)
      
      const response = NextResponse.json({ 
        results: mockResults,
        note: "Using fallback analysis due to AI service unavailability" 
      })
      response.headers.set('X-Fallback-Mode', 'true')
      
      return response
    }
    
  } catch (error) {
    console.error("Analysis failed:", error)
    
    // Determine error type and provide appropriate response
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body" }, 
        { status: 400 }
      )
    }
    
    // Handle AI service specific errors
    if (isErrorOfType(error, "rate limit") || isErrorOfType(error, "quota")) {
      return NextResponse.json(
        { error: "AI service rate limit exceeded. Please try again later." }, 
        { status: 503 }
      )
    }
    
    // Handle timeout errors
    if (isErrorOfType(error, "timeout") || isErrorOfType(error, "ETIMEDOUT")) {
      return NextResponse.json(
        { error: "Request timed out. Please try again." }, 
        { status: 504 }
      )
    }
    
    // Log the actual error message for debugging
    const errorMessage = getErrorMessage(error)
    console.error("Detailed error:", errorMessage)
    
    return NextResponse.json(
      { error: "Analysis service temporarily unavailable" }, 
      { status: 500 }
    )
  }
}

// Add OPTIONS handler for CORS if needed
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}











// import { type NextRequest, NextResponse } from "next/server"
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai" // ✅ use this (default function)

// export async function POST(request: NextRequest) {
//   try {
//     const { code, language, analysisTypes } = await request.json()

//     if (!code || !language || !analysisTypes) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     const prompt = `
// You are an expert code reviewer. Analyze the following ${language} code for: ${analysisTypes.join(", ")}.

// \`\`\`${language}
// ${code}
// \`\`\`

// Return JSON like:
// {
//   "results": [
//     {
//       "category": "bugs|performance|security|style",
//       "severity": "low|medium|high",
//       "line": number,
//       "message": "Brief description of issue",
//       "suggestion": "Detailed suggestion",
//       "code": "Optional fix"
//     }
//   ]
// }
// `

//     const { text } = await generateText({
//       model: openai("gpt-3.5-turbo"), // ✅ free-tier GPT model
//       prompt,
//       temperature: 0.3,
//     })

//     // Try parsing AI response as JSON
//     let analysisResult
//     try {
//       const jsonMatch = text.match(/\{[\s\S]*\}/)
//       analysisResult = jsonMatch ? JSON.parse(jsonMatch[0]) : { results: [] }
//     } catch {
//       analysisResult = {
//         results: [
//           {
//             category: "bugs",
//             severity: "medium",
//             line: 1,
//             message: "AI response could not be parsed. Fallback triggered.",
//             suggestion: "Make sure your AI response is formatted correctly.",
//           },
//         ],
//       }
//     }

//     return NextResponse.json(analysisResult)
//   } catch (error) {
//     console.error("Analysis failed:", error)
//     return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
//   }
// }
