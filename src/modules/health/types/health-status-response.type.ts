import { CheckState, HealthStatus } from './health.enums';

export type HealthStatusResponse = {
  status: HealthStatus;
  checks: {
    api: CheckState;
    database: CheckState;
  };
  timestamp: string;
  version: string;
};
