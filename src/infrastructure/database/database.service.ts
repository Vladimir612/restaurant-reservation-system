import { Injectable, OnApplicationShutdown, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(@InjectConnection() private readonly connection: Connection) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    this.logger.log(
      `Shutting down (signal: ${signal ?? 'unknown'}) → closing MongoDB...`,
    );

    try {
      await this.connection.close();
      this.logger.log('MongoDB connection closed.');
    } catch (error) {
      this.logger.error('Error closing MongoDB connection', error);
    }
  }
}
