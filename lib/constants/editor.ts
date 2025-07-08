import { Bug, Zap, Shield, Palette } from "lucide-react"

export const SUPPORTED_LANGUAGES = [
  {
    value: "javascript",
    label: "JavaScript",
    extensions: ["js", "jsx"],
    sampleCode: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Potential issues:
// 1. No input validation
// 2. Inefficient recursive approach
// 3. Stack overflow for large n
console.log(fibonacci(40));`,
  },
  {
    value: "python",
    label: "Python",
    extensions: ["py"],
    sampleCode: `def process_data(data):
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
  },
  {
    value: "typescript",
    label: "TypeScript",
    extensions: ["ts", "tsx"],
    sampleCode: `interface User {
  id: number;
  name: string;
}

function getUser(id: number): User | null {
  // TODO: Add proper error handling
  return { id, name: "John Doe" };
}`,
  },
  {
    value: "java",
    label: "Java",
    extensions: ["java"],
    sampleCode: `public class Example {
    public static void main(String[] args) {
        // TODO: Add sample Java code
        System.out.println("Hello World");
    }
}`,
  },
  {
    value: "cpp",
    label: "C++",
    extensions: ["cpp", "cc", "cxx"],
    sampleCode: `#include <iostream>
using namespace std;

int main() {
    // TODO: Add sample C++ code
    cout << "Hello World" << endl;
    return 0;
}`,
  },
  {
    value: "go",
    label: "Go",
    extensions: ["go"],
    sampleCode: `package main

import "fmt"

func main() {
    // TODO: Add sample Go code
    fmt.Println("Hello World")
}`,
  },
  {
    value: "rust",
    label: "Rust",
    extensions: ["rs"],
    sampleCode: `fn main() {
    // TODO: Add sample Rust code
    println!("Hello World");
}`,
  },
  {
    value: "php",
    label: "PHP",
    extensions: ["php"],
    sampleCode: `<?php
// TODO: Add sample PHP code
echo "Hello World";
?>`,
  },
]

export const ANALYSIS_TYPES = [
  { id: "bugs", label: "Bug Detection", icon: Bug, color: "text-red-400" },
  { id: "performance", label: "Performance", icon: Zap, color: "text-yellow-400" },
  { id: "security", label: "Security", icon: Shield, color: "text-green-400" },
  { id: "style", label: "Style Guide", icon: Palette, color: "text-blue-400" },
]

export const SEVERITY_LEVELS = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const

export const ANALYSIS_CATEGORIES = {
  BUGS: "bugs",
  PERFORMANCE: "performance",
  SECURITY: "security",
  STYLE: "style",
} as const
