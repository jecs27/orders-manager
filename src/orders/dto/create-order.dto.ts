import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItem {
  @IsNotEmpty()
  id_producto: string;

  @IsNotEmpty()
  cantidad: number;

  @IsNotEmpty()
  precio_unitario: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  id_usuario: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItem)
  items: OrderItem[];
}
