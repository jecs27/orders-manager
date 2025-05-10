import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { KafkaService } from '../kafka/kafka.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly kafkaService: KafkaService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Creates a new order in the system
   * @param dto - Data transfer object containing order details
   * @returns The saved order document
   * @throws BadRequestException if order contains no items
   */
  async createOrder(dto: CreateOrderDto) {
    // Validate that order has at least one item
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un ítem');
    }
  
    // Calculate total order amount by summing (quantity * unit price) for each item
    const total = dto.items.reduce((acc, item) => {
      return acc + item.cantidad * item.precio_unitario;
    }, 0);
  
    // Create new order document with calculated total
    const createdOrder = new this.orderModel({
      ...dto,
      total,
    });
  
    // Save order to database and emit event to Kafka
    const savedOrder = await createdOrder.save();
    await this.kafkaService.emit(savedOrder, 'ordenes_creadas');
  
    // Invalidate Redis cache to ensure data consistency
    await this.redisService.flushAll();
  
    return savedOrder;
  }
  
  /**
   * Lists orders with pagination and optional user filtering
   * @param page - Page number for pagination (default: 1)
   * @param limit - Number of items per page (default: 10) 
   * @param id_usuario - Optional user ID to filter orders
   * @returns Array of order documents
   */
  async listOrders(page = 1, limit = 10, id_usuario?: string) {
    // Generate cache key based on query parameters
    const cacheKey = `orders:${id_usuario ?? 'all'}:page:${page}:limit:${limit}`;
  
    // Check if results are cached in Redis
    const cached = await this.redisService.get(cacheKey);
    if (cached) return cached;
  
    const query: any = {};
    if (id_usuario) query.id_usuario = id_usuario;
  
    // Query database with pagination
    const orders = await this.orderModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  
    // Cache results for 5 minutes (300 seconds)
    await this.redisService.set(cacheKey, orders, 300);
    return orders;
  }
}
