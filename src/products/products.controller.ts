import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { auth, GetUser } from 'src/users/decorators';
import { validRoles } from 'src/users/interfaces/valid-roles.interface';
import { User } from 'src/users/entities/user.entity';
import { Product } from './entities/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiResponse({status: 201, description: 'everything works ok', type: Product})
  @auth(validRoles.superAdmin)
  create(
    @Body() createProductDto: CreateProductDto, 
    @GetUser() vendor: User) {
    return this.productsService.create(createProductDto, vendor);
  }

  @Get()
  findAll( @Query() PaginationDto: PaginationDto ) {
    return this.productsService.findAll(PaginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
