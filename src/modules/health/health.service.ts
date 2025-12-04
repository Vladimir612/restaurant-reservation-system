import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection, ConnectionStates } from 'mongoose';
import { HealthStatusResponse } from './types/health-status-response.type';
import { CheckState, HealthStatus } from './types/health.enums';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  getHealthStatus(): HealthStatusResponse {
    const dbReady =
      this.connection.readyState === ConnectionStates.connected
        ? CheckState.UP
        : CheckState.DOWN;

    return {
      status: dbReady === CheckState.UP ? HealthStatus.OK : HealthStatus.ERROR,
      checks: {
        api: CheckState.UP,
        database: dbReady,
      },
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
    };
  }
}
