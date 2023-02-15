import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RoutesModule,
    MongooseModule.forRoot(process.env.MONGO_DSN),
  ],
  controllers: [AppController],
})
export class AppModule {}
