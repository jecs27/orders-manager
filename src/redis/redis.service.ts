import { Injectable, OnModuleDestroy, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly logger = new Logger(RedisService.name);
  private readonly maxRetries = 5;
  private retryCount = 0;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      url: this.configService.get<string>('redis.url'),
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > this.maxRetries) {
            this.logger.error('Max retries reached. Could not connect to Redis');
            return new Error('Max retries reached');
          }
          return Math.min(retries * 100, 3000);
        },
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.client.on('error', (err) => {
      this.logger.error('Redis Client Error:', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Redis Client Connected');
      this.retryCount = 0;
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('Redis Client Reconnecting...');
      this.retryCount++;
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Redis connected successfully');
    } catch (err) {
      this.logger.error('Failed to connect to Redis:', err);
      throw err;
    }
  }

  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      if (ttlSeconds) {
        await this.client.set(key, val, { EX: ttlSeconds });
      } else {
        await this.client.set(key, val);
      }
    } catch (err) {
      this.logger.error(`Error setting key ${key}:`, err);
      throw err;
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    try {
      const val = await this.client.get(key);
      if (!val) return null;
      
      try {
        return JSON.parse(val) as T;
      } catch {
        return val as unknown as T;
      }
    } catch (err) {
      this.logger.error(`Error getting key ${key}:`, err);
      throw err;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.error(`Error deleting key ${key}:`, err);
      throw err;
    }
  }

  async flushAll(): Promise<void> {
    try {
      await this.client.flushAll();
    } catch (err) {
      this.logger.error('Error flushing Redis:', err);
      throw err;
    }
  }

  async onModuleDestroy() {
    try {
      await this.client.quit();
      this.logger.log('Redis connection closed');
    } catch (err) {
      this.logger.error('Error closing Redis connection:', err);
    }
  }
}
