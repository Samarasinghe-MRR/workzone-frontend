# RabbitMQ Setup Guide for Your Project

## 1️⃣ Install RabbitMQ (Windows)

### Option A: Download & Install
1. Download Erlang: https://www.erlang.org/downloads
2. Download RabbitMQ: https://www.rabbitmq.com/download.html
3. Install both in order (Erlang first, then RabbitMQ)
4. RabbitMQ will run as Windows service automatically

### Option B: Using Chocolatey (if you have it)
```bash
choco install rabbitmq
```

### Verify Installation
Open browser: http://localhost:15672
- Username: guest
- Password: guest

## 2️⃣ Install NestJS Dependencies

In both your auth-service and user-service:
```bash
npm install @nestjs/microservices amqplib amqp-connection-manager
npm install -D @types/amqplib
```

## 3️⃣ Architecture Overview

```
Frontend → auth-service → [creates user] → publishes "UserCreated" event
                                              ↓
user-service ← subscribes to events ← RabbitMQ Queue
```

## 4️⃣ Implementation Files

### auth-service/src/rabbitmq/rabbitmq.service.ts
```typescript
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      
      // Declare exchange and queue
      await this.channel.assertExchange('user_events', 'direct', { durable: true });
      console.log('✅ Connected to RabbitMQ');
    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error);
    }
  }

  async publishUserCreated(userData: any) {
    const message = {
      eventType: 'UserCreated',
      timestamp: new Date().toISOString(),
      data: userData
    };

    await this.channel.publish(
      'user_events',
      'user.created',
      Buffer.from(JSON.stringify(message))
    );
    
    console.log('📤 Published UserCreated event:', userData.email);
  }

  async onModuleDestroy() {
    await this.channel?.close();
    await this.connection?.close();
  }
}
```

### auth-service/src/auth/auth.service.ts (Updated)
```typescript
// Add to your existing auth.service.ts
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly rabbitMQService: RabbitMQService, // Add this
  ) {}

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: string;
  }) {
    // ... your existing code ...

    // After successful user creation, publish event
    await this.rabbitMQService.publishUserCreated({
      authUserId: authUser.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
    });

    return { id: authUser.id, email: authUser.email };
  }
}
```

### user-service/src/rabbitmq/rabbitmq.consumer.ts
```typescript
import { Injectable } from '@nestjs/common';
import * as amqp from 'amqplib';
import { UserService } from '../user/user.service';

@Injectable()
export class RabbitMQConsumer {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly userService: UserService) {}

  async connect() {
    try {
      this.connection = await amqp.connect('amqp://localhost');
      this.channel = await this.connection.createChannel();
      
      await this.channel.assertExchange('user_events', 'direct', { durable: true });
      
      const queue = await this.channel.assertQueue('user_service_queue', { durable: true });
      await this.channel.bindQueue(queue.queue, 'user_events', 'user.created');
      
      await this.channel.consume(queue.queue, this.handleUserCreated.bind(this));
      
      console.log('✅ User service listening for events...');
    } catch (error) {
      console.error('❌ RabbitMQ connection failed:', error);
    }
  }

  private async handleUserCreated(message: amqp.ConsumeMessage | null) {
    if (!message) return;

    try {
      const event = JSON.parse(message.content.toString());
      console.log('📥 Received UserCreated event:', event.data.email);

      // Create user profile in user-service database
      await this.userService.createUserFromAuthEvent({
        authUserId: event.data.authUserId,
        email: event.data.email,
        firstName: event.data.firstName,
        lastName: event.data.lastName,
        phone: event.data.phone,
        role: event.data.role,
      });

      this.channel.ack(message);
      console.log('✅ User profile created successfully');
    } catch (error) {
      console.error('❌ Error processing UserCreated event:', error);
      this.channel.nack(message, false, true); // Retry
    }
  }
}
```

### user-service/src/user/user.service.ts (Add method)
```typescript
// Add this method to your existing user.service.ts
async createUserFromAuthEvent(userData: {
  authUserId: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}) {
  return await this.prisma.user.create({
    data: {
      authUserId: userData.authUserId,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      status: 'ACTIVE',
      createdAt: new Date(),
    },
  });
}
```

## 5️⃣ Module Configuration

### auth-service/src/app.module.ts
```typescript
import { RabbitMQService } from './rabbitmq/rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  // ... other config
})
export class AppModule implements OnModuleInit {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async onModuleInit() {
    await this.rabbitMQService.connect();
  }
}
```

### user-service/src/app.module.ts
```typescript
import { RabbitMQConsumer } from './rabbitmq/rabbitmq.consumer';

@Module({
  providers: [RabbitMQConsumer],
  // ... other config
})
export class AppModule implements OnModuleInit {
  constructor(private readonly rabbitMQConsumer: RabbitMQConsumer) {}

  async onModuleInit() {
    await this.rabbitMQConsumer.connect();
  }
}
```

## 6️⃣ Testing the Flow

1. Start RabbitMQ service
2. Start auth-service on port 4000
3. Start user-service on port 3001
4. Register a user through your frontend
5. Check both databases - user should be in both!

## 7️⃣ Environment Variables

Create `.env` files in both services:
```env
RABBITMQ_URL=amqp://localhost:5672
```

This setup ensures proper microservice communication with event-driven architecture!
