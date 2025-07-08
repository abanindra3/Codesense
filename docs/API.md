# CodeSense API Documentation

## Endpoints

### POST /api/analyze
Analyze code for bugs, performance, security, and style issues.

**Request Body:**
\`\`\`json
{
  "code": "string",
  "language": "string",
  "analysisTypes": ["bugs", "performance", "security", "style"],
  "options": {
    "maxIssues": 20,
    "includeWarnings": true,
    "customRules": []
  }
}
\`\`\`

**Response:**
\`\`\`json
{
  "results": [
    {
      "category": "bugs",
      "severity": "high",
      "line": 5,
      "message": "Potential null pointer exception",
      "suggestion": "Add null check before accessing property",
      "code": "if (obj !== null) { ... }",
      "ruleId": "NULL_CHECK",
      "documentation": "https://docs.codesense.ai/rules/null-check"
    }
  ]
}
\`\`\`

## TODO: Add more API documentation
- Authentication endpoints
- User management
- Session management
- File upload/download
- Analytics endpoints
