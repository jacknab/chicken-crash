export class CrashPointManager {
  constructor() {
    this.crashPoints = new Map(); // sessionId -> crash point
  }

  generateCrashPoint(sessionId) {
    // 70% chance of having a crash point
    if (Math.random() > 0.7) {
      this.crashPoints.set(sessionId, null);
      return null;
    }

    // Generate crash point between lanes 2 and 15
    const crashLane = Math.floor(Math.random() * 14) + 2;
    const patterns = ['wall', 'zigzag', 'pincer'];
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    const crashPoint = {
      lane: crashLane,
      pattern,
      triggered: false,
      vehicles: []
    };

    this.crashPoints.set(sessionId, crashPoint);
    return crashPoint;
  }

  getCrashPoint(sessionId) {
    return this.crashPoints.get(sessionId);
  }

  clearSession(sessionId) {
    this.crashPoints.delete(sessionId);
  }
}
