import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { Image } from "./product-image.entity";
import { User } from "src/users/entities/user.entity";


@Entity()
export class Product {
    @ApiProperty({
        example:'b03d8d4e-29ee-43be-b34b-edfdb740f370',
        description: 'ID Product',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ApiProperty()
    @Column('text',{
        unique: true
    })
    title: string

    @ApiProperty()
    @Column('float', {
        default: 0,
        
    })
    price: number

    @ApiProperty()
    @Column('text', {
        nullable: true
    })
    description: string

    @ApiProperty()
    @Column('text', {
        unique: true
    })
    slug:string

    @ApiProperty()
    @Column('int', {
        default: 0
    })
    stock: number

    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes: string[]

    @ApiProperty()
    @Column('text')
    gender: string

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[]

    @ApiProperty()
    @OneToMany(
        () => Image,
        productImage => productImage.product,
        {
            cascade: true,
            eager: true
        }
    )
    images?: Image[]

    @ApiProperty({
        type: User
    })
    @ManyToOne(
        () => User,
        user => user.product,
        {eager: true}
    )
    Vendor: User

    @BeforeInsert()
    checkSlug(){
        if(!this.slug){
            this.slug = this.title.toLowerCase()
              .replaceAll(" ", "-")
              .replaceAll("'", "")
        }
        this.slug = this.slug.toLowerCase()
            .replaceAll(" ", "-")
            .replaceAll("'", "")
          
    }

    @BeforeUpdate()
    updateSlug(){
        
        this.slug = this.slug.toLowerCase()
        .replaceAll(" ", "-")
        .replaceAll("'", "")
        
    }

}
