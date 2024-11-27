import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import {validate} from 'uuid'

import { Product } from './entities/product.entity';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Image } from './entities/product-image.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Image)
    private readonly productImageRepository: Repository<Image>,

    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto, Vendor: User) {
    try {
      const {images = [], ...detailProduct} = createProductDto
      if(!Vendor || !detailProduct.title) throw new BadRequestException()
      const product = this.productRepository.create({
        ...detailProduct, 
        images: images.map(image => this.productImageRepository.create({name: image})),
        Vendor
      })

      await this.productRepository.save(product)

      return {...product, images}

    } catch (err) {
      this.logger.error(err)
      throw new InternalServerErrorException()
    }
  }

  async findAll(PaginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = PaginationDto
    const products = await this.productRepository.find({
      take: limit, skip: offset, relations: {images: true}
    })
    return products;
  }

  async findOne(id: string) {
    
    let product: Product

    if(validate(id))
      product = await this.productRepository.findOneBy({id})
    
    else {
      const queryBuilder = this.productRepository.createQueryBuilder("prod")
      product = await queryBuilder.where(
        `UPPER(title) =:title or slug =:slug`, {
          title: id.toUpperCase(), slug: id.toLowerCase() 
        }
      )
      .leftJoinAndSelect("prod.images", "prodImages")
      .getOne()

      //product = await this.productRepository.findOneBy({slug: id})
    }

    
    if(!product) throw new BadRequestException()
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const {images, ...detailProduct} = updateProductDto
    const product = await this.productRepository.preload({
      id, ...detailProduct
    })

    if(!product) throw new BadGatewayException()

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      if(images){
        await queryRunner.manager.delete(Image, {product: {id}})
        product.images = images.map(img => this.productImageRepository.create({name:  img}))  
      }

      await queryRunner.manager.save( product )
      await queryRunner.commitTransaction()
      await queryRunner.release()

      return this.findOne(product.id)

    } catch (error) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new InternalServerErrorException(error)
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.delete({id})
    
    return product;
  }

  async deleteAllProducts(){
    const query = this.productRepository.createQueryBuilder('product')

    try {
      return await query
        .delete()
        .where({})
        .execute()
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
}
