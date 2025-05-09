import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KafkaService } from '../kafka/kafka.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly kafkaService: KafkaService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un ítem');
    }

    const total = dto.items.reduce((acc, item) => {
      return acc + item.cantidad * item.precio_unitario;
    }, 0);

    const createdOrder = new this.orderModel({
      ...dto,
      total,
    });

    const savedOrder = await createdOrder.save();
    await this.kafkaService.emit(savedOrder, 'ordenes_creadas');

    return savedOrder;
  }

  async listOrders(page = 1, limit = 10, id_usuario?: string) {
    const query: any = {};
    if (id_usuario) query.id_usuario = id_usuario;

    const orders = await this.orderModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return orders;
  }
}
