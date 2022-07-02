import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoosModule } from './resources/foos/foos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { JWTAuthStrategy } from './guards/auth/jwt-auth.strategy';
import { BasicAuthStrategy } from './guards/auth/basic-auth.strategy';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGODB_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      ssl: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    FoosModule,
  ],
  controllers: [AppController],
  providers: [AppService, JWTAuthStrategy, BasicAuthStrategy],
})
export class AppModule {}
