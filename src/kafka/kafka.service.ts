import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private topic: string;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const brokers = [this.configService.get<string>('KAFKA_BROKER') || 'defaultBroker'];
    const clientId = this.configService.get<string>('KAFKA_CLIENT_ID') || 'defaultClientId';
    this.topic = this.configService.get<string>('KAFKA_TOPIC_ORDENES_CREADAS') || 'defaultTopic';

    this.kafka = new Kafka({ clientId, brokers });
    this.producer = this.kafka.producer();
    await this.producer.connect();
  }

  async emit(message: any, topicOverride?: string) {
    const topic = topicOverride || this.topic;
    if (!topic || typeof topic !== 'string') {
      throw new Error(`Invalid Kafka topic: ${topic}`);
    }
  
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }
}
