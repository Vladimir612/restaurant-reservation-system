import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { mongooseConfig } from './mongoose.config';
import { DatabaseService } from './database.service';

@Module({
  imports: [ConfigModule, MongooseModule.forRootAsync(mongooseConfig)],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
