import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { KafkaService } from '../kafka/kafka.service';
import { ConfigModule } from '@nestjs/config';
import { RedisService } from 'src/redis/redis.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, KafkaService, RedisService],
})
export class OrdersModule {}
