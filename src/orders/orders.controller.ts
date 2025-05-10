import { Controller, Get, Post, Query, Body, Req, Res } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request, Response } from 'express';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: CreateOrderDto
  ) {
    const order = await this.ordersService.createOrder(dto);
    return res.status(201).json({
      statusCode: 201,
      message: "Order created successfully",  
      order
    });
  }

  @Get()
  async findAll(
    @Req() req: Request,
    @Res() res: Response,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('id_usuario') id_usuario?: string,
  ) {
    const orders = await this.ordersService.listOrders(page, limit, id_usuario);
    return res.status(200).json({
      statusCode: 200,
      message: "Orders retrieved successfully",
      orders
    });
  }
}
