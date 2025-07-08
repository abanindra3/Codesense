import type { CodeSession } from "@/types/editor"

class CodeHistoryService {
  private readonly STORAGE_KEY = "codesense-sessions"

  async getSessions(): Promise<CodeSession[]> {
    // TODO: Replace with actual API call to backend
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  async getSession(id: string): Promise<CodeSession> {
    const sessions = await this.getSessions()
    const session = sessions.find((s) => s.id === id)
    if (!session) {
      throw new Error("Session not found")
    }
    return session
  }

  async saveSession(session: CodeSession): Promise<CodeSession> {
    // TODO: Replace with actual API call to backend
    const sessions = await this.getSessions()
    const updatedSessions = [session, ...sessions.filter((s) => s.id !== session.id)]
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedSessions))
    return session
  }

  async deleteSession(id: string): Promise<void> {
    // TODO: Replace with actual API call to backend
    const sessions = await this.getSessions()
    const filteredSessions = sessions.filter((s) => s.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredSessions))
  }

  // TODO: Add more methods
  // - syncWithCloud()
  // - exportSessions()
  // - importSessions()
  // - searchSessions()
}

export const codeHistoryService = new CodeHistoryService()
