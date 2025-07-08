"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code2,
  Shield,
  Zap,
  Bug,
  Palette,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
  Play,
  Sparkles,
  Brain,
  Target,
} from "lucide-react"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const features = [
  {
    icon: Bug,
    title: "Bug Detection",
    description: "Identify potential bugs, logic errors, and vulnerabilities in your code",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  {
    icon: Zap,
    title: "Performance Analysis",
    description: "Optimize time complexity, memory usage, and overall performance",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
  },
  {
    icon: Shield,
    title: "Security Audit",
    description: "Detect security vulnerabilities and suggest secure coding practices",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  {
    icon: Palette,
    title: "Style Guide",
    description: "Ensure code follows best practices and style conventions",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
]

const stats = [
  { number: "10M+", label: "Lines Analyzed" },
  { number: "50K+", label: "Developers" },
  { number: "99.9%", label: "Accuracy" },
  { number: "< 2s", label: "Analysis Time" },
]

const languages = ["JavaScript", "Python", "TypeScript", "Java", "C++", "Go", "Rust", "PHP"]

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            transition: "all 0.3s ease-out",
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <motion.nav
        className="relative z-50 p-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Code2 className="h-8 w-8 text-purple-400" />
              <div className="absolute inset-0 bg-purple-400 blur-lg opacity-30" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CodeSense
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="#features" className="hover:text-purple-400 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="hover:text-purple-400 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="hover:text-purple-400 transition-colors">
              About
            </Link>
            <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/10 bg-transparent">
              Sign In
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Badge className="mb-6 bg-purple-500/20 text-purple-300 border-purple-500/30">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Code Analysis
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              CodeSense
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your code quality with AI-powered reviews. Get instant feedback on
              <span className="text-purple-400"> bugs</span>,<span className="text-yellow-400"> performance</span>,
              <span className="text-green-400"> security</span>, and
              <span className="text-blue-400"> style</span>.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/editor">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                Try CodeSense Free
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 hover:bg-gray-800 px-8 py-4 text-lg bg-transparent"
            >
              <Github className="w-5 h-5 mr-2" />
              View on GitHub
            </Button>
          </motion.div>

          {/* Language Support */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {languages.map((lang, index) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
              >
                <Badge
                  variant="secondary"
                  className="bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  {lang}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {stats.map((stat, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Intelligent Code Analysis</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered engine combines static analysis with advanced language models to provide comprehensive code
              reviews in seconds.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300 group hover:scale-105">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">How It Works</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Get professional code reviews in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Paste Your Code",
                description: "Simply paste your code snippet or upload a file. We support 8+ programming languages.",
                icon: Code2,
              },
              {
                step: "02",
                title: "AI Analysis",
                description:
                  "Our AI engine analyzes your code for bugs, performance issues, security vulnerabilities, and style.",
                icon: Brain,
              },
              {
                step: "03",
                title: "Get Insights",
                description: "Receive detailed feedback with line-by-line suggestions and actionable improvements.",
                icon: Target,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-sm font-bold text-purple-400">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
            <CardContent className="p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Improve Your Code?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of developers who trust CodeSense for better code quality. Start your free analysis
                today.
              </p>
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg group"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Start Free Analysis
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Code2 className="h-6 w-6 text-purple-400" />
              <span className="text-xl font-bold">CodeSense</span>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 CodeSense. All rights reserved. Built with AI for developers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
