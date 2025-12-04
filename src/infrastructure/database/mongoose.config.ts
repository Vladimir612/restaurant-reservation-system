import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { Connection, ConnectionStates, MongooseError } from 'mongoose';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig = {
  imports: [],
  useFactory: (configService: ConfigService): MongooseModuleOptions => ({
    uri: configService.get<string>('DB_CONNECTION_STRING'),
    connectionFactory: (connection: Connection): Connection => {
      if (connection.readyState === ConnectionStates.connected) {
        Logger.log('MongoDB connected', 'Database');
      }

      connection.on('error', (err: MongooseError) => {
        Logger.error(
          `MongoDB connection error: ${err.message}`,
          err,
          'Database',
        );
      });

      return connection;
    },
  }),
  inject: [ConfigService],
};
