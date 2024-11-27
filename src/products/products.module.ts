import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Image } from './entities/product-image.entity';
import { JwtStrategy } from 'src/users/strategies/jwt.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product, Image]),
    UsersModule,
  ]
})
export class ProductsModule {}
