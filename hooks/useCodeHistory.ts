"use client"

import { useState, useEffect } from "react"
import type { CodeSession } from "@/types/editor"

export function useCodeHistory() {
  const [sessions, setSessions] = useState<CodeSession[]>([])
  const [currentSession, setCurrentSession] = useState<CodeSession | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    setIsLoading(true)
    try {
      const stored = localStorage.getItem("codesense-sessions")
      const loadedSessions = stored ? JSON.parse(stored) : []
      setSessions(loadedSessions)
    } catch (error) {
      console.error("Failed to load sessions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveSession = async (session: CodeSession) => {
    try {
      const updatedSessions = [session, ...sessions.filter((s) => s.id !== session.id)]
      setSessions(updatedSessions)
      localStorage.setItem("codesense-sessions", JSON.stringify(updatedSessions))
      setCurrentSession(session)
      return session
    } catch (error) {
      console.error("Failed to save session:", error)
      throw error
    }
  }

  const loadSession = async (sessionId: string) => {
    try {
      const session = sessions.find((s) => s.id === sessionId)
      if (!session) {
        throw new Error("Session not found")
      }
      setCurrentSession(session)
      return session
    } catch (error) {
      console.error("Failed to load session:", error)
      throw error
    }
  }

  const deleteSession = async (sessionId: string) => {
    try {
      const filteredSessions = sessions.filter((s) => s.id !== sessionId)
      setSessions(filteredSessions)
      localStorage.setItem("codesense-sessions", JSON.stringify(filteredSessions))
      if (currentSession?.id === sessionId) {
        setCurrentSession(null)
      }
    } catch (error) {
      console.error("Failed to delete session:", error)
      throw error
    }
  }

  return {
    sessions,
    currentSession,
    isLoading,
    saveSession,
    loadSession,
    deleteSession,
    refreshSessions: loadSessions,
  }
}
