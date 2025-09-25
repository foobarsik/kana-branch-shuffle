// Telemetry system for tracking game events
export interface TelemetryEvent {
  event: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface GameStartEvent {
  event: 'game_start';
  data: {
    attempt_id: string;
    level_id: string;
    kanaCount: number;
  };
}

export interface SetCompletedEvent {
  event: 'set_completed';
  data: {
    attempt_id: string;
    setsDone: number;
    score: number;
  };
}

export interface LevelCompleteEvent {
  event: 'level_complete';
  data: {
    attempt_id: string;
    score: number;
    time_ms: number;
  };
}

export interface LevelAbandonEvent {
  event: 'level_abandon';
  data: {
    attempt_id: string;
    score: number;
    time_ms: number;
  };
}

export type TelemetryEventData = 
  | GameStartEvent 
  | SetCompletedEvent 
  | LevelCompleteEvent 
  | LevelAbandonEvent;

class TelemetryService {
  private attemptId: string;
  private events: TelemetryEvent[] = [];
  private gameStartTime: number | null = null;

  constructor() {
    this.attemptId = this.generateAttemptId();
  }

  private generateAttemptId(): string {
    return `attempt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private createEvent<T extends TelemetryEventData>(eventData: T): TelemetryEvent {
    return {
      event: eventData.event,
      timestamp: Date.now(),
      data: eventData.data
    };
  }

  public trackGameStart(levelId: string, kanaCount: number): void {
    this.gameStartTime = Date.now();
    const event: GameStartEvent = {
      event: 'game_start',
      data: {
        attempt_id: this.attemptId,
        level_id: levelId,
        kanaCount
      }
    };
    
    const telemetryEvent = this.createEvent(event);
    this.events.push(telemetryEvent);
    this.logEvent(telemetryEvent);
  }

  public trackSetCompleted(setsDone: number, score: number): void {
    const event: SetCompletedEvent = {
      event: 'set_completed',
      data: {
        attempt_id: this.attemptId,
        setsDone,
        score
      }
    };
    
    const telemetryEvent = this.createEvent(event);
    this.events.push(telemetryEvent);
    this.logEvent(telemetryEvent);
  }

  public trackLevelComplete(score: number): void {
    if (!this.gameStartTime) {
      console.warn('Cannot track level complete: game start time not recorded');
      return;
    }

    const time_ms = Date.now() - this.gameStartTime;
    const event: LevelCompleteEvent = {
      event: 'level_complete',
      data: {
        attempt_id: this.attemptId,
        score,
        time_ms
      }
    };
    
    const telemetryEvent = this.createEvent(event);
    this.events.push(telemetryEvent);
    this.logEvent(telemetryEvent);
  }

  public trackLevelAbandon(score: number): void {
    if (!this.gameStartTime) {
      console.warn('Cannot track level abandon: game start time not recorded');
      return;
    }

    const time_ms = Date.now() - this.gameStartTime;
    const event: LevelAbandonEvent = {
      event: 'level_abandon',
      data: {
        attempt_id: this.attemptId,
        score,
        time_ms
      }
    };
    
    const telemetryEvent = this.createEvent(event);
    this.events.push(telemetryEvent);
    this.logEvent(telemetryEvent);
  }

  private logEvent(event: TelemetryEvent): void {
    console.log('📊 Telemetry Event:', event);
    // In a real implementation, this would send to an analytics service
    // For now, we'll just log to console
  }

  public getEvents(): TelemetryEvent[] {
    return [...this.events];
  }

  public clearEvents(): void {
    this.events = [];
  }

  public resetAttempt(): void {
    this.attemptId = this.generateAttemptId();
    this.gameStartTime = null;
    this.clearEvents();
  }

  public getAttemptId(): string {
    return this.attemptId;
  }
}

// Export singleton instance
export const telemetry = new TelemetryService();
