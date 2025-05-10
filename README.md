## Order Manager

### 1. Environment Setup

First, create a `.env` file in the root directory based on the following template:

```env
# App
PORT=3000

# MongoDB
MONGODB_URI=mongodb://root:example@localhost:27017/ordenes?authSource=admin

# Kafka
KAFKA_BROKER=host.docker.internal:9092
KAFKA_CLIENT_ID=ordenes-service
KAFKA_TOPIC_ORDENES_CREADAS=ordenes_creadas
```

### 2. Start Infrastructure with Docker Compose

The application requires several services to run properly. Start them using Docker Compose:

```bash
# Start all required services (MongoDB, Redis, and Kafka)
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Redis on port 6379
- Kafka on port 9092

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Application

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

## Architecture

```mermaid
graph TB
    subgraph Client
        API[API Client]
    end

    subgraph Order Manager Service
        App[NestJS Application]
        API --> App
    end

    subgraph Infrastructure
        subgraph Database
            MongoDB[(MongoDB)]
            Redis[(Redis Cache)]
        end

        subgraph Message Broker
            Kafka[Kafka Broker]
        end
    end

    App --> MongoDB
    App --> Redis
    App --> Kafka

    style App fill:#f9f,stroke:#333,stroke-width:2px
    style MongoDB fill:#85C1E9,stroke:#333,stroke-width:2px
    style Redis fill:#FF6B6B,stroke:#333,stroke-width:2px
    style Kafka fill:#98FB98,stroke:#333,stroke-width:2px
```

### Components Description

- **NestJS Application**: The main application server handling HTTP requests and business logic
- **MongoDB**: Primary database for storing order data
- **Redis**: In-memory cache for improving performance
- **Kafka**: Message broker for handling asynchronous events and communication between services

## Project Structure

```
src/
├── app.module.ts              # Main application module
├── main.ts                    # Application entry point
├── config/                    # Configuration files
│   └── config.ts              # Configuration
├── kafka/                     # Kafka integration
│   └── kafka.service.ts       # Kafka service implementation
├── redis/                     # Redis integration
│   └── redis.service.ts       # Redis service implementation
├── orders/                    # Orders module
│   ├── orders.module.ts       # Orders module definition
│   ├── orders.controller.ts   # Orders REST endpoints
│   ├── orders.service.ts      # Orders business logic
│   ├── dto/                   # Data Transfer Objects
│   │   └── create-order.dto.ts # Order creation DTO
│   ├── schemas/               # Database schemas
│   │   └── order.schema.ts    # Order MongoDB schema
│   └── interfaces/            # TypeScript interfaces
│       └── order.interface.ts # Order interface definition
.env                           # Environment variables
```

### Key Components

- **app.module.ts**: Root module that bootstraps the application
- **main.ts**: Application entry point with server configuration
- **config/**: Contains configuration files for external services
- **kafka/**: Handles message broker integration
- **redis/**: Optional caching layer implementation
- **orders/**: Core business logic for order management
  - **dto/**: Data validation and transfer objects
  - **schemas/**: MongoDB schema definitions
  - **interfaces/**: TypeScript type definitions

## API Documentation

The API provides the following endpoints:

### Create Order
- **Method**: POST
- **Endpoint**: `/orders`
- **Body**:
```json
{
    "id_usuario": "1234",
    "items": [
        {
            "id_producto": "ac-01238",
            "cantidad": 30,
            "precio_unitario": 10.25
        }
    ]
}
```

### Get All Orders
- **Method**: GET
- **Endpoint**: `/orders`
- **Query Parameters**:
  - `limit`: Number of records per page (default: 10)
  - `page`: Page number for pagination
  - `id_usuario`: Filter orders by user ID
- **Example**: `/orders?limit=1&page=2&id_usuario=1235`

### Health Check
- **Method**: GET
- **Endpoint**: `/`
- **Purpose**: Verify if the service is running properly

## Docker

### Building and Running the Application

1. Build the application:
```bash
# Build the Docker image
docker build -t order-manager .
```

2. Run the application:
```bash
# Run the container exposing port 3000
docker run -d \
  --name order-manager \
  -p 3000:3000 \
  --network app-network \
  order-manager
```

3. Verify the application is running:
```bash
# Check container status
docker ps

# View application logs
docker logs -f order-manager
```

4. Access the application:
- The API will be available at `http://localhost:3000`
- Health check endpoint: `http://localhost:3000/health`

5. Stop the application:
```bash
# Stop the container
docker stop order-manager

# Remove the container
docker rm order-manager
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

## 🚀 Nice to Have / Future Improvements
These features are not currently implemented but would significantly enhance the system if added:
| Feature             | Description                                           | Status     |
| ------------------- | ----------------------------------------------------- | ---------- |
| Authentication      | Validate users via JWT authentication                 | 🔜 Pending |
| Roles & Permissions | Support for user roles like `admin`, `user`, `seller` | 🔜 Pending |
| User Management     | User registration, login, profile update, etc.        | 🔜 Pending |
| Product Module      | Manage product catalog and associate with orders      | 🔜 Pending |
| Inventory System    | Track product stock and availability before ordering  | 🔜 Pending |
