import { ApiProperty } from '@nestjs/swagger';
import { CheckState, HealthStatus } from '../types/health.enums';

class HealthChecksDto {
  @ApiProperty({ enum: CheckState })
  api!: CheckState;

  @ApiProperty({ enum: CheckState })
  database!: CheckState;
}

export class HealthResponseDto {
  @ApiProperty({ enum: HealthStatus })
  status!: HealthStatus;

  @ApiProperty({ type: HealthChecksDto })
  checks!: HealthChecksDto;

  @ApiProperty({ example: new Date().toISOString() })
  timestamp!: string;

  @ApiProperty({ example: '1.0.0' })
  version!: string;
}
