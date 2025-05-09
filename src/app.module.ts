import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { Kafka } from 'kafkajs';
import { KafkaService } from './kafka/kafka.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('mongo.uri');
        console.log('Conectando a MongoDB en:', uri);
        return {
          uri,
        };
      },
    }),
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService, KafkaService],
})
export class AppModule {}
