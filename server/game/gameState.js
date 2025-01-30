// Game state storage
const sessions = new Map();

export class GameState {
  static getSessions() {
    return sessions;
  }

  static getSession(sessionId) {
    return sessions.get(sessionId);
  }

  static createSession(sessionData) {
    sessions.set(sessionData.id, sessionData);
    return sessionData;
  }

  static updateSession(sessionId, updates) {
    const session = sessions.get(sessionId);
    if (session) {
      Object.assign(session, updates);
      return session;
    }
    return null;
  }

  static deleteSession(sessionId) {
    return sessions.delete(sessionId);
  }
}
