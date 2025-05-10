import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px;">
        <h1>Bienvenido al sistema de gestión de órdenes</h1>
        
        <h2>Este servicio permite:</h2>
        <ul style="line-height: 1.6;">
          <li>Crear y gestionar órdenes de compra</li>
          <li>Integración con Kafka para procesamiento de eventos</li>
          <li>Almacenamiento en MongoDB</li>
          <li>Caché con Redis para mejor rendimiento</li>
        </ul>
      </div>
    `;
  }
}
