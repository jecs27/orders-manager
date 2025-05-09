import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: 'fecha_creacion' } })
export class Order extends Document {
  @Prop({ required: true })
  id_usuario: string;

  @Prop([
    {
      id_producto: String,
      cantidad: Number,
      precio_unitario: Number,
    },
  ])
  items: Array<{
    id_producto: string;
    cantidad: number;
    precio_unitario: number;
  }>;

  @Prop()
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
